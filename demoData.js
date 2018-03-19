$todoListDemoData = {
  $root: [
    {
      parent: '$root',
      text: 'Complete watchandcode',
      completed: false,
      dateCreated: '19/04/2018',
      subTodo: null
    },
    {
      parent: '$root',
      text: 'master js',
      completed: false,
      dateCreated: '19/04/2018',
      subTodo: [
        {
          parent: 'master js',
          text: 'master vue.js',
          completed: false,
          dateCreated: '19/04/2018',
          subTodo: [
            {
              parent: 'master vue.js',
              text: 'complete tutorial',
              completed: false,
              dateCreated: '19/04/2018',
              subTodo: null
            },
            {
              parent: 'master vue.js',
              text: 'read documentation for each feature (don\'t rush)',
              completed: false,
              dateCreated: '19/04/2018',
              subTodo: null
            }
          ]
        }
      ]
    },
  ]
}