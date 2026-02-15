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

const updatePosts = (state) => {
  const promises = state.data.feeds
    .map((feed) => getAxiosResponse(feed.url)
      .then((response) => {
        const content = response.data.contents
        const { posts } = parser(content)

        const oldPosts = state.data.posts.map((post) => post.postLink)
        const newPosts = posts.filter((post) => !oldPosts.includes(post.postLink))
        if (newPosts.length > 0) {
          const normalizedNewPosts = newPosts.map((post) => ({ id: uniqueId(), feedId: feed.id, ...post }))
          state.data.posts = [...normalizedNewPosts, ...state.data.posts]
        }
      })
      .catch((error) => {
        state.loadingProcess.error = i18nextInstance.t('isNetworkError')
      }))

  Promise.allSettled(promises)
    .finally(() => setTimeout(() => updatePosts(state), 5000))
}

const watchedState = onChange(state, render(elements, state, i18nextInstance))
updatePosts(watchedState)

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
      const normalizedFeed = { id: feedId, url: inputValue, ...feed }
      watchedState.data.feeds = [normalizedFeed, ...watchedState.data.feeds]

      const normalizedPosts = posts.map((post) => ({ id: uniqueId(), feedId: feedId, ...post }))
      watchedState.data.posts = [...normalizedPosts, ...watchedState.data.posts]

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
