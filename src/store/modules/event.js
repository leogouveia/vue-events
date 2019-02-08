import EventServices from '../../services/EventService'

export const namespaced = true

export const state = {
  events: [],
  eventsTotal: 0,
  perPage: 2,
  event: {}
}

export const mutations = {
  ADD_EVENT(state, event) {
    state.events.push(event)
  },
  SET_EVENTS(state, events) {
    state.events = events
  },
  SET_EVENTS_TOTAL(state, eventsTotal) {
    state.eventsTotal = eventsTotal
  },
  SET_EVENT(state, event) {
    state.event = event
  }
}

export const actions = {
  createEvent({ commit, rootState, dispatch }, event) {
    return EventServices.postEvent(event)
      .then(() => {
        console.log('User creating Event is ', rootState.user.user.name)
        commit('ADD_EVENT', event)
        const notification = {
          type: 'success',
          message: 'Your event has been created'
        }
        dispatch('notification/add', notification, { root: true })
      })
      .catch(error => {
        const notification = {
          type: 'error',
          message: 'There was a problem creating your event: ' + error.message
        }
        dispatch('notification/add', notification, { root: true })
        throw error
      })
  },
  fetchEvents({ commit, dispatch, state }, { page }) {
    return EventServices.getEvents(state.perPage, page)
      .then(response => {
        const totalEvents = response.headers['x-total-count'] || 0
        commit('SET_EVENTS_TOTAL', totalEvents)
        commit('SET_EVENTS', response.data)
        return response.data
      })
      .catch(error => {
        const notification = {
          type: 'error',
          message: 'There was a problem fetching events: ' + error.message
        }
        dispatch('notification/add', notification, { root: true })
        console.log('There was an error:', error.response)
      })
  },
  fetchEvent({ commit }, id) {
    return EventServices.getEvent(id).then(response => {
      commit('SET_EVENT', response.data)
      return response.data
    })
    // .catch(error => {
    //   const notification = {
    //     type: 'error',
    //     message: 'There was a problem fetching an event: ' + error.message
    //   }
    //   dispatch('notification/add', notification, { root: true })
    //   console.error('Error getting event from db', error)
    // })
  }
}

export const getters = {
  getEventById: state => id => state.events.find(event => event.id === id)
}
