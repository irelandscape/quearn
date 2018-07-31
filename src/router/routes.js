
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', component: () => import('pages/index') }
    ]
  },
  {
    path: '/auth',
    children: [
      {
        path: 'callback',
        name: 'auth.callback',
        component: () => import('components/steemlogincallback')
      }
    ]
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
