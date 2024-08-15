const URLS = {
  me: {
    profile: 'me/profile',
    activity: 'me/activity',
  },
  admin: {
    list: 'admins',
  },
  auth: {
    register: {
      student: 'auth/students/register',
      admin: 'auth/admins/register',
    },
    signin: {
      student: 'auth/signin',
    },
    password: {
      change: 'auth/change-password',
      reset: 'auth/reset-password',
      confirm: 'auth/confirm-reset-password',
    },
  },
  courses: {
    list: 'courses',
    cover: 'cover',
    progress: 'progress',
    enrolled: 'enrolled',
  },
  wilayas: {
    list: 'wilayas',
  },
  communes: {
    list: 'communes',
  },
  tags: {
    list: 'tags',
  },
  supervisors: {
    list: 'supervisors',
    invitation: 'me/supervisor-invitations',
    confirm: 'supervisor-invitations/confirm',
  },
  instructors: {
    list: 'instructors',
  },
  sections: {
    list: 'sections',
  },
  lessons: {
    list: 'lessons',
    detailed: 'lessons-detailed',
  },
  elements: {
    list: 'elements',
    completed: 'completed',
  },
  quizzes: {
    list: 'quizzes',
  },
  questions: {
    list: 'questions',
    exam: 'exam-questions',
    student: 'student-answer',
  },
  subscribtions: {
    list: 'payment/subscription-plans',
    student: 'student-subscriptions',
    proof: 'proof-file',
  },
  serials: {
    list: 'payment/serial-numbers',
    subscribe: 'payment/serial-numbers/subscribe',
  },
  methods: {
    list: 'payment/methods',
  },
  proof: {
    create: 'payment/proof/upload',
  },
  satim: {
    register: 'payment/satim/register',
    verify: 'payment/satim/verify',
    refund: 'payment/satim/refund',
  },
  students: {
    list: 'students',
  },
  oauth2: {
    facebook: 'oauth2/authorization/facebook',
    google: 'oauth2/authorization/google',
  },
};

export { URLS };

export default URLS;
