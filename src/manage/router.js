import { createRouter, createWebHashHistory } from 'vue-router';
import ChannelList from './pages/ChannelList.vue';
import ChannelDetails from './pages/ChannelDetails.vue';
import ExportMarkdown from './pages/ExportMarkdown.vue';

const routes = [
  {
    path: '/',
    name: 'channels',
    component: ChannelList
  },
  {
    path: '/channel/:id',
    name: 'channel-details',
    component: ChannelDetails,
    props: true
  },
  {
    path: '/export',
    name: 'export-markdown',
    component: ExportMarkdown
  }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});