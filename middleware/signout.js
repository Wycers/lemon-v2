export default function({ store, redirect, error }) {
  try {
    store.dispatch('auth/signout')
    redirect('/')
  } catch (err) {
    error(err)
  }
}
