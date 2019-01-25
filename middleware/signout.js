export default function({ store, redirect, error }) {
  try {
    store.dispatch('user/signout')
    redirect('/')
  } catch (err) {
    error(err)
  }
}
