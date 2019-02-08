<template>
  <div>
    <h1>Events for {{ user.name }}</h1>
    <EventCard v-for="event in event.events" :key="event.id" :event="event"/>
    <template v-if="page != 1">
      <router-link :to="{ name: 'event-list', query: {page: page-1}}" rel="prev">Prev Page</router-link>&nbsp;|&nbsp;
    </template>
    <template v-if="hasNextPage">
      <router-link :to="{ name: 'event-list', query: {page: page+1}}" rel="next">Next Page</router-link>
    </template>
  </div>
</template>

<script>
import EventCard from '@/components/EventCard.vue'
import store from '../store/store'
import { mapState } from 'vuex'

function getPageEvents(routeTo, next) {
  const currentPage = parseInt(routeTo.query.page) || 1
  store
    .dispatch('event/fetchEvents', {
      page: currentPage
    })
    .then(() => {
      routeTo.params.page = currentPage
      next()
    })
}

export default {
  components: {
    EventCard
  },
  props: {
    page: {
      type: Number,
      default: 1
    },
    totalPages: {
      type: Number,
      required: true
    }
  },
  beforeRouteEnter(routeTo, routeFrom, next) {
    getPageEvents(routeTo, next)
  },
  beforeRouteUpdate(routeTo, routeFrom, next) {
    getPageEvents(routeTo, next)
  },
  computed: {
    hasNextPage() {
      return this.event.eventsTotal > this.page * this.event.perPage
    },
    ...mapState(['event', 'user'])
  }
}
</script>
