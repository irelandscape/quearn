
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      {
        path: '',
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
            component: () => import('components/tabnewquestion')
          },
          {
            path: 'search',
            name: 'search',
            component: () => import('components/tabsearch')
          },
          {
            path: 'about',
            name: 'about',
            component: () => import('components/tababout')
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
