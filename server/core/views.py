import datetime
import logging
import os
import traceback

from flask import Blueprint, Response, request, jsonify, make_response, stream_with_context
from flask_jwt_extended import (
    jwt_required, create_access_token, get_jwt_identity, create_refresh_token
)
from flask_restful import Resource
from ollama import Client, chat, ChatResponse
from markupsafe import escape

from server import app, api, JWT_ACCESS_TOKEN_TIMEDELTA, JWT_REFRESH_TOKEN_TIMEDELTA
# from server.common import mem_cache
from server.common.constants import (
    API_STATUS_SUCCESS, API_STATUS_FAILURE, API_STATUS_ERROR, DEFAULT_PAGE, DEFAULT_PER_PAGE
)

core_blueprint = Blueprint('core', __name__)

logger = logging.getLogger(__name__)


class Ping(Resource):
    def get(self):
        return jsonify({"message": "pong"})


class Login(Resource):
    def post(self):
        if not request.is_json:
            return jsonify({'status': API_STATUS_FAILURE, "msg": "Missing JSON in request"})

        username = request.json.get('username', None)
        password = request.json.get('password', None)
        try:
            if not username:
                return jsonify({'status': API_STATUS_FAILURE, "msg": "Missing username parameter"})
            if not password:
                return jsonify({'status': API_STATUS_FAILURE, "msg": "Missing password parameter"})

            if username != os.environ['JWT_USERNAME'] or password != os.environ['JWT_PASSWORD']:
                return jsonify({'status': API_STATUS_FAILURE, "msg": "Bad username or password"})

            # Identity can be any data that is json serializable
            access_token = create_access_token(
                identity=username, expires_delta=JWT_ACCESS_TOKEN_TIMEDELTA)
            refresh_token = create_refresh_token(
                identity=username, expires_delta=JWT_REFRESH_TOKEN_TIMEDELTA)
            return make_response(
                jsonify({'status': API_STATUS_SUCCESS, 'access_token': access_token, 'refresh_token': refresh_token}))
        except Exception as e:
            logger.error(e)
            logger.debug(traceback.format_exc())
            return make_response(jsonify({'status': API_STATUS_ERROR}))


class TokenRefresh(Resource):
    @jwt_required(refresh=True)
    def post(self):
        try:
            current_user = get_jwt_identity()
            access_token = create_access_token(
                identity=current_user, expires_delta=JWT_ACCESS_TOKEN_TIMEDELTA)
            return make_response(
                jsonify(
                    {
                        'status': API_STATUS_SUCCESS, 'message': 'Access Token Generated', 'access_token': access_token
                    }
                ), 200)
        except Exception as e:
            logger.error(e)
            return make_response(jsonify({'status': API_STATUS_ERROR, 'message': 'Something went wrong'}), 500)


class Protected(Resource):
    @jwt_required
    def post(self):
        try:
            current_user = get_jwt_identity()
            return jsonify({'logged_in_as': current_user})
        except Exception as e:
            logger.error(e)
            logger.debug(traceback.format_exc())
            return make_response(jsonify({'status': API_STATUS_ERROR}))


class Chat(Resource):
    def post(self):
        if not request.is_json:
            return jsonify({'status': API_STATUS_FAILURE, "msg": "Missing JSON in request"})

        prompt = request.json.get('prompt', None)
        # role = request.json.get('role', None)
        user = request.json.get('user', None)

        try:
            client = Client(
                host='http://ollama:11434',
                headers={'x-some-header': 'some-value'}
            )
            stream = client.chat(
                model='llama3.2:3b',
                messages=[
                    {
                        'role': 'user',
                        'content': prompt,
                    }
                ],
                stream=True
            )
            def generate():
                for chunk in stream:
                    yield (chunk['message']['content'])

            return Response(stream_with_context(generate()), content_type='text/plain')
        except Exception as e:
            logger.error(e)
            logger.debug(traceback.format_exc())
            return make_response(jsonify({'status': API_STATUS_ERROR}))


class ChatSync(Resource):
    def post(self):
        if not request.is_json:
            return jsonify({'status': API_STATUS_FAILURE, "msg": "Missing JSON in request"})

        prompt = request.json.get('prompt', None)
        # role = request.json.get('role', None)
        user = request.json.get('user', None)

        try:
            client = Client(
                host='http://ollama:11434',
                headers={'x-some-header': 'some-value'}
            )
            response: ChatResponse = client.chat(model='llama3.2:3b', messages=[
                {
                    'role': 'user',
                    'content': prompt,
                },
            ])
            print(response.message.content)
            return make_response(
                jsonify({'status': API_STATUS_SUCCESS, 'message': response.message.content}))
        except Exception as e:
            logger.error(e)
            logger.debug(traceback.format_exc())
            return make_response(jsonify({'status': API_STATUS_ERROR}))


class Stream(Resource):
    def get(self):
        if not request.query_string:
            return jsonify({'status': API_STATUS_FAILURE, "msg": "Missing Query string in request"})

        prompt = request.args.get('word')
        user = request.args.get('user')
        
        # system_prompt = "I want your answer to be only one sentence long. Keep the word count low, and skip any disclaimers or examples. Keep the structure of the response like so: user word in romanized form, user word in devanagari followed by refers to ... continue with definition for 5 to 15 more words. End with one additional sentence with this structure: Closest english equivalent word: word goes here " # First try, before learning about prompt engineering.
        # system_prompt = "“Respond in one concise sentence without disclaimers or examples. Format: , , refers to … (provide a definition in 5-15 words). Conclude with: Closest English equivalent: .”"
        # system_prompt = "Respond in one concise sentence without disclaimers or examples. Format: User word title-case, (user word in Hindi), refers to … (provide a definition in 5-15 words). Conclude with: Closest English equivalent: ."
        # system_prompt = "Respond in one concise sentence without disclaimers or examples. Format: User word title-case, (user word in Hindi), refers to … (provide a definition in 5-15 words). Always conclude with this exact phrase: \'Closest English equivalent: (closest english equivalent word)\'. Do not omit this phrase under any circumstances." # 2nd BEST PROMPT SO FAR!!
        system_prompt = "Respond in one concise sentence without disclaimers or examples. Format: User word title-case, (user word in Hindi), refers to … (provide a definition in 5-15 words). Always conclude with this exact phrase: \'Closest English equivalent: (closest english equivalent single word)\'. Do not omit this phrase under any circumstances." # BEST PROMPT SO FAR!!

        try:
            client = Client(
                host='http://ollama:11434',
                headers={'x-some-header': 'some-value'}
            )
            stream = client.chat(
                model='llama3.2:3b',
                messages=[
                    {
                        'role': 'user',
                        'content': "{}\n\nuser word: {}".format(system_prompt, prompt),
                    }
                ],
                stream=True
            )
            def generate():
                for chunk in stream:
                    yield (chunk['message']['content'])

            return Response(stream_with_context(generate()), content_type='text/plain')
        except Exception as e:
            logger.error(e)
            logger.debug(traceback.format_exc())
            return make_response(jsonify({'status': API_STATUS_ERROR}))


api.add_resource(Ping, '/ping')
api.add_resource(Login, '/login')
api.add_resource(TokenRefresh, '/refresh')
api.add_resource(Protected, '/protected')
api.add_resource(Chat, '/chat')
api.add_resource(ChatSync, '/chat-sync')
api.add_resource(Stream, '/stream')
