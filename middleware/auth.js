export default function({ store, error }) {
  if (!store.state.auth.token) {
    error({
      message: 'You need to login',
      statusCode: 403
    })
  }
}
