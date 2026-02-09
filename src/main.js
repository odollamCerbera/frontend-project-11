import './styles.scss'
import 'bootstrap'
import * as yup from 'yup'
import onChange from 'on-change'
import i18next from 'i18next'
import axios from 'axios'
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
    errors: [],
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

const watchedState = onChange(state, function (path, value) {
  console.log('path:', path, 'value:', value)
  render(elements, state, i18nextInstance)
})

const axiosResponse = (url) => {
  const proxy = 'https://allorigins.hexlet.app/get'
  const newProxy = new URL(proxy)
  newProxy.searchParams.append('disableCache', 'true')
  newProxy.searchParams.append('url', url)
  return axios.get(newProxy)
}

elements.formRss.addEventListener('submit', (event) => {
  event.preventDefault()

  watchedState.formRss.stateForm = 'processing'

  validateUrl(elements.inputUrl.value, watchedState.data.links)
    .then(({ currentUrl }) => {
      watchedState.formRss.currentUrl = currentUrl
      watchedState.formRss.stateForm = 'success'
      watchedState.formRss.isValid = true
      watchedState.formRss.error = ''
      watchedState.data.links.push(currentUrl)
    })
    .catch((error) => {
      watchedState.formRss.currentUrl = ''
      watchedState.formRss.stateForm = 'failed'
      watchedState.formRss.isValid = false
      watchedState.formRss.error = error.message
    })
    .then(() => {
      return axiosResponse(watchedState.formRss.currentUrl)
      // Тут может быть ошибка, которую нужно обработать + изменение стэйт: процесс загрузки
    })
    .then((response) => {
      const content = response.data.contents
      console.log(content)
      const { feed, posts } = parser(content)
      console.log(feed, posts)
    })
})
