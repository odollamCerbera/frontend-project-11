import './styles.scss'
import 'bootstrap'
import * as yup from 'yup'
import onChange from 'on-change'
import i18next from 'i18next'
import axios from 'axios'
import uniqueId from 'lodash/uniqueId.js'
import resources from './locales.js'
import render from './view.js'
import parser from './parser.js'

const defaultLocale = 'ru'

const elements = {
  formRss: document.querySelector('.rss-form'),
  inputUrl: document.querySelector('#url-input'),
  buttonAddUrl: document.querySelector('[aria-label="add"]'),
  feedback: document.querySelector('.feedback'),
  posts: document.querySelector('.posts'),
  feeds: document.querySelector('.feeds'),
}

const state = {
  formRss: {
    stateForm: 'filling', // 'processing', 'failed', 'success'
    isValid: true,
    error: '',
  },
  loadingProcess: {
    status: 'initializing', // 'loading', 'failed', 'success'
    error: '',
  },
  data: {
    posts: [],
    feeds: [],
    links: [],
  },
}

const i18nextInstance = i18next.createInstance()
i18nextInstance.init({
  lng: defaultLocale,
  debug: true,
  resources,
})
  .then(() => {
    yup.setLocale({
      mixed: {
        required: 'isEmpty',
        notOneOf: 'isAlreadyExists',
      },
      string: {
        url: 'isInvalidUrl',
      }
    })
  })

const validateUrl = (url, urls) => {
  const schema = yup.string().required().url().notOneOf(urls)
  return schema.validate(url)
}

const getAxiosResponse = (url) => {
  const proxy = new URL('https://allorigins.hexlet.app/get')
  proxy.searchParams.append('disableCache', true)
  proxy.searchParams.append('url', url)
  return axios.get(proxy)
}

const watchedState = onChange(state, render(elements, state, i18nextInstance))

elements.formRss.addEventListener('submit', (event) => {
  event.preventDefault()

  watchedState.formRss.stateForm = 'processing'
  const inputValue = elements.inputUrl.value.trim()

  validateUrl(inputValue, watchedState.data.links)
    .then(() => {
      watchedState.formRss.isValid = true
      watchedState.formRss.error = ''
      watchedState.formRss.stateForm = 'success'
    })
    .then(() => {
      watchedState.loadingProcess.status = 'loading'
      return getAxiosResponse(inputValue)
    })
    .then((response) => {
      const content = response.data.contents
      const { feed, posts } = parser(content)

      const feedId = uniqueId()
      watchedState.data.feeds.push({ id: feedId, ...feed })
      posts.forEach(post => watchedState.data.posts.push({ id: uniqueId(), feedId: feedId, ...post }))

      watchedState.data.links.push(inputValue)
      watchedState.loadingProcess.error = ''
      watchedState.loadingProcess.status = 'success'
    })
    .catch((error) => {
      watchedState.loadingProcess.status = 'failed'
      switch (error.name) {
        case 'ValidationError':
          watchedState.formRss.isValid = false
          watchedState.formRss.error = i18nextInstance.t(error.message)
          watchedState.formRss.stateForm = 'failed'
        case 'AxiosError':
          watchedState.loadingProcess.error = i18nextInstance.t('isNetworkError')
          break
        case 'Error':
          watchedState.loadingProcess.error = i18nextInstance.t('isInvalidRSS')
          break
        default:
          break
      }
    })
})
