import mitt from 'mitt'

type Events = {
  applyFilters: any
}

const emitter = mitt<Events>()
export default emitter
