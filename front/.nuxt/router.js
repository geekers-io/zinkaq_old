import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _cdc71f52 = () => interopDefault(import('../pages/mint.vue' /* webpackChunkName: "pages/mint" */))
const _1a20d3ad = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))
const _1cdc28b3 = () => interopDefault(import('../pages/_userName/index.vue' /* webpackChunkName: "pages/_userName/index" */))
const _7aae9839 = () => interopDefault(import('../pages/_userName/edit.vue' /* webpackChunkName: "pages/_userName/edit" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/mint",
    component: _cdc71f52,
    name: "mint"
  }, {
    path: "/",
    component: _1a20d3ad,
    name: "index"
  }, {
    path: "/:userName",
    component: _1cdc28b3,
    name: "userName"
  }, {
    path: "/:userName/edit",
    component: _7aae9839,
    name: "userName-edit"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
