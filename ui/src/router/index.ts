import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import AppView from '@/views/AppView.vue';
import OverviewView from '@/views/activity/OverviewView.vue';
import EarningsView from '@/views/activity/EarningsView.vue';
import DonateView from '@/views/donate/DonateView.vue';
import DonateDetailView from '@/views/donate/DonateDetailView.vue';
import CouponsView from '@/views/inventory/CouponsView.vue';
import AchievementsView from '@/views/inventory/AchievementsView.vue';
import GCardView from '@/views/gcard/GCardView.vue';
import CallbackView from '@/views/auth/CallbackView.vue';
import NewProposalView from '@/views/donate/NewProposalView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: CallbackView
    },
    {
      path: '/app',
      name: 'app',
      component: AppView,
      children: [
        {
          path: '/app',
          name: 'app-activity',
          children: [
            {
              path: '/app',
              name: 'app-activity-overview',
              component: OverviewView
            },
            {
              path: '/app/activity/earnings',
              name: 'app-activity-earnings',
              component: EarningsView
            },
          ]
        },
        {
          path: '/app/donate',
          name: 'app-donate',
          children: [
            {
              path: '/app/donate',
              name: 'app-donate',
              component: DonateView
            },
            {
              path: '/app/donate/:id',
              name: 'app-donate-id',
              component: DonateDetailView
            },
            {
              path: '/app/donate/:id/create',
              name: 'app-donate-id-create',
              component: NewProposalView
            }
          ]
        },
        {
          path: '/app/inventory',
          name: 'app-inventory',
          children: [
            {
              path: '/app/inventory/coupons',
              name: 'app-inventory-coupons',
              component: CouponsView
            },
            {
              path: '/app/inventory/achievements',
              name: 'app-inventory-achievements',
              component: AchievementsView
            }
          ]
        },
        {
          path: '/app/gcard',
          name: 'app-gcard',
          component: GCardView
        },
      ]
    },
  ]
});

export default router;
