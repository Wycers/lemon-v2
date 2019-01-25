export default function({ store, error }) {
  if (!store.state.user.token) {
    error({
      message: 'You need to login',
      statusCode: 403
    })
  }
}
