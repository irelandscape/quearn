
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
            component: () => import('../components/tabs/tabhome'),
            props: true
          },
          {
            path: 'newquestion',
            name: 'newquestion',
            component: () => import('../components/tabs/tabnewquestion')
          },
          {
            path: 'topics',
            name: 'topics',
            component: () => import('../components/tabs/tabtopics')
          },
          {
            path: 'news',
            name: 'news',
            component: () => import('../pages/news')
          }
        ]
      },
      {
        path: 'question/:author/:permlink',
        name: 'question',
        component: () => import('pages/question'),
        props: true
      },
      {
        path: 'answer',
        name: 'answer',
        component: () => import('pages/answer'),
        props: true
      },
      {
        path: 'bookmarks',
        name: 'bookmarks',
        component: () => import('pages/bookmarks')
      },
      {
        path: 'userquestions',
        name: 'userquestions',
        component: () => import('pages/userquestions'),
        props: true
      },
      {
        path: 'useranswers',
        name: 'useranswers',
        component: () => import('pages/useranswers'),
        props: true
      },
      {
        path: 'my_topics',
        name: 'my_topics',
        component: () => import('pages/my_topics')
      },
      {
        path: 'help',
        name: 'help',
        component: () => import('pages/help'),
        props: true
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('pages/about'),
        props: true
      }
    ]
  },
  {
    path: '/steemlogin/success',
    component: () => import('components/steemloginsuccess'),
    props: true
  },
  {
    path: '/steemlogin/failure',
    component: () => import('components/steemloginfailure'),
    props: true
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
