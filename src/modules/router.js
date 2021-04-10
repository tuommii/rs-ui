import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Settings from "@/views/Settings.vue";
import useAuth from './auth';

if (process.env.VUE_APP_ENV === 'dev') {
  // Comment to cheat linter
} else {
  // Cheat linter
}

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { authOnly: false },
  },
	{
		path: "/settings",
		name: "Settings",
		component: Settings,
		meta: { authOnly: true },
	},
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { guestOnly: true },
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const { setToken, setUsername, getToken, getUsername } = useAuth();

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.authOnly)) {
    // TODO: Refactor
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const key = cookies[i].split('=');
      if (key.length != 2) {
        next('/login')
        return;
      }
      if (key[0].trim() === 'user_id') {
        setUsername(key[1]);
      }
      if (key[0].trim() === 'session') {
        setToken(key[1])
      }
    }

    if (getToken() === '' || getUsername() === '') {
      next('/login');
      return ;
    }

    next();
    return;
  }


  // TODO: Refactor
  let cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const key = cookies[i].split('=');
    if (key.length != 2) {
      break;
    }

    if (key[0].trim() === 'user_id') {
      setUsername(key[1])
    }
    else if (key[0].trim() === 'session') {
      setToken(key[1])
    }
  }
  // No login required
  next();
});

export default router;
