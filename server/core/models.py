import logging
import traceback
from datetime import datetime
from typing import Text

from pymongo import errors

from server import mongo, app

logger = logging.getLogger(__name__)


