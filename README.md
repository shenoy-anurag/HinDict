# Overview
Dictionary to learn Hindi words, their meanings, synonyms, antonyms and usage.

📖 HinDict 📖  - My new LLM powered project!

## Demo
![Demo: Definition of the hindi word Aadhyatmik](./docs/hindict-demo-aadhyatmik.gif)

More images and videos in the `docs` folder of this repository!

## Motivations
I recently wanted to read Hindi literature, and I stumbled upon many words I didn't have in my vocabulary. I realized I am quick at reading Hindi, but slow at writing Hindi in Devanagari.

I wondered if there was an app where I could write Hindi in English / Latin alphabet (romanization) and obtain it's meaning and English equivalent. When I struggled to find one, I decided to embark on an NLP and LLM journey to make one myself.

I brushed up my skills with using open-source LLMs such as Llama3.2 and deploying them using Ollama inside a Docker container, and used prompt engineering to provide the user with a small succinct answer.

## Tech
Built the front-end in Next.js and the back-end using Flask web framework.

## Thoughts
I'm pretty sure the LLM is overkill for this use-case (despite picking the small 3B parameter model), but I wanted to have fun building with LLMs. Currently fine-tuning a smaller model to save on costs.
