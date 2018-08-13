
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      {
        path: '',
        name: 'main',
        component: () => import('pages/main'),
        children: [
          {
            path: '',
            name: 'home',
            component: () => import('components/tabhome'),
            props: true
          },
          {
            path: 'newquestion',
            name: 'newquestion',
            component: () => import('components/tabnewquestion'),
            props: true
          },
          {
            path: 'search',
            name: 'search',
            component: () => import('components/tabsearch'),
            props: true
          }
        ]
      },
      {
        path: 'question',
        name: 'question',
        component: () => import('pages/question'),
        props: true
      }
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
