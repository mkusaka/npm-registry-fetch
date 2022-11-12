import nock from 'nock'
import { clearMemoized } from 'cacache'

export default tnock

function tnock (t, host) {
  clearMemoized()
  const server = nock(host)
  t.teardown(function () {
    server.done()
  })
  return server
}
