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
    currentUrl: '',
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
        required: i18nextInstance.t('isEmpty'),
        notOneOf: i18nextInstance.t('isAlreadyExists'),
      },
      string: {
        url: i18nextInstance.t('isInvalidUrl'),
      }
    })
  })

const createSchema = (urls) => yup.object().shape({
  currentUrl: yup
    .string().trim()
    .url()
    .required()
    .notOneOf(urls)
})

const validateUrl = (url, urls) => {
  const schema = createSchema(urls)
  return schema.validate({ currentUrl: url })
}

const watchedState = onChange(state, render(elements, state, i18nextInstance))

const getAxiosResponse = (url) => {
  const proxy = new URL('https://allorigins.hexlet.app/get')
  proxy.searchParams.append('disableCache', true)
  proxy.searchParams.append('url', url)
  return axios.get(proxy)
}

elements.formRss.addEventListener('submit', (event) => {
  event.preventDefault()

  watchedState.formRss.stateForm = 'processing'
  const inputValue = elements.inputUrl.value

  validateUrl(inputValue, watchedState.data.links)
    .then(({ currentUrl }) => {
      watchedState.formRss.currentUrl = currentUrl
      watchedState.formRss.isValid = true
      watchedState.formRss.error = ''
      watchedState.formRss.stateForm = 'success'
    })
    .then(() => {
      watchedState.loadingProcess.status = 'loading'
      return getAxiosResponse(watchedState.formRss.currentUrl)
    })
    .then((response) => {
      watchedState.data.links.push(inputValue)
      const content = response.data.contents
      const { feed, posts } = parser(content)

      const feedId = uniqueId()
      watchedState.data.feeds.push({ id: feedId, ...feed })
      posts.forEach(post => watchedState.data.posts.push({ id: uniqueId(), feedId: feedId, ...post }))

      watchedState.loadingProcess.error = ''
      watchedState.loadingProcess.status = 'success'
    })
    .catch((error) => {
      // console.log(error.name)
      watchedState.loadingProcess.status = 'failed'
      switch (error.name) {
        case 'ValidationError':
          watchedState.formRss.currentUrl = ''
          watchedState.formRss.isValid = false
          watchedState.formRss.stateForm = 'failed'
          watchedState.formRss.error = error.message
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
