import './styles.scss'
import 'bootstrap'
import * as yup from 'yup'
import onChange from 'on-change'

const elements = {
  rssForm: document.querySelector('.rss-form'),
  urlInput: document.querySelector('#url-input'),
  feedback: document.querySelector('.feedback'),
  posts: document.querySelector('.posts'),
  feeds: document.querySelector('.feeds'),
}

console.log(elements)
