import './App.css';
import { useState, useEffect } from 'react'
import axios from 'axios'
import Timeline from './Timeline';

/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/

/*
bg-green-600
bg-red-600
*/
export function App() {
  const [checked, setChecked] = useState(false)
  const [color, setColor] = useState('green')
  const [rememberMe, setRememberMe] = useState(true)
  const [data, setData] = useState({
    user: localStorage.getItem('user') || '',
    password: localStorage.getItem('password') || '',
    otp: localStorage.getItem('otp') || '',
    wfh: localStorage.getItem('wfh') || false,
    backend: localStorage.getItem('backend') || 'https://portal2api.mavs.dev/',
    token: localStorage.getItem('token') || ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [advanced, setAdvanced] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [timeline, setTimeline] = useState([])

  function rememberMeHandler(e) {
    const remember = e.target.checked
    setRememberMe(remember)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (data.token === '') {
      axios.post(data.backend + 'login', {
        user: data.user,
        password: data.password,
        otp: data.otp,
        wfh: false
      }).then((response) => {
        if (response.status === 200) {
          if (rememberMe) {
            localStorage.setItem('user', data.user)
            localStorage.setItem('password', data.password)
            localStorage.setItem('otp', data.otp)
            localStorage.setItem('backend', data.backend)
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('wfh', data.wfh)
          } else {
            localStorage.removeItem('user')
            localStorage.removeItem('password')
            localStorage.removeItem('otp')
            localStorage.removeItem('backend')
            localStorage.removeItem('token')
            localStorage.removeItem('wfh')
          }
          setData({ ...data, token: response.data.token })
          setSuccess('Login correcto')
        }
      }).catch((error) => {
        console.log(error)
        setError('Error al hacer login')
      })
    }
    else {
      axios.post(data.backend + 'clock-in',
        {
          wfh: data.wfh
        },
        {
          headers: {
            'Authorization': data.token
          }
        }).then((response) => {
          setTimeline([...timeline, { time: "Ahora", type: timeline.length % 2 === 0 ? "Entrada" : "Salida", wfh: data.wfh }])
          setSuccess('Check-in/out correcto')
        }).catch((error) => {
          console.log(error)
          setError('Error al hacer check-in/out')
        })
    }
  }

  function getChecks() {
    if (data.token === '') return
    axios.get(data.backend + 'clock-ins', {
      headers: {
        'Authorization': data.token
      }
    }).then((response) => {
      if (response.status === 200) {
        let clock_ins = response.data['clock_ins']
        clock_ins = clock_ins.concat(response.data['clock_ins_pending'])
        setTimeline(clock_ins)
        clock_ins.length % 2 === 0 ? setChecked(false) : setChecked(true)
        setColor(clock_ins.length % 2 === 0 ? 'green' : 'red')
      }
    })
  }

  useEffect(() => {
    getChecks()
  }, [data.token])

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        {error && (
          <div id="toast-danger" class="fixed top-5 right-5 flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
            <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
              <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
              </svg>
              <span class="sr-only">Error icon</span>
            </div>
            <div class="ms-3 text-sm font-normal">{error}</div>
            <button type="button" class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-danger" aria-label="Close" onClick={(e) => setError('')}>
              <span class="sr-only">Close</span>
              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
            </button>
          </div>
        )}
        {success && (
          <div id="toast-success" class="fixed top-5 right-5 flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
            <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
              <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M10 0c5.523 0 10 4.477 10 10s-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0zm5.707 7.293a1 1 0 0 0-1.414-1.414L9 12.586l-2.293-2.293a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0l5-5z" />
              </svg>
              <span class="sr-only">Success icon</span>
            </div>
            <div class="ms-3 text-sm font-normal">{success}</div>
            <button type="button" class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-success" aria-label="Close" onClick={(e) => setSuccess('')}>
              <span class="sr-only">Close</span>
              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
            </button>
          </div>
        )}
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-auto w-30"
            src="logo.png"
            alt="Portal2"
          />
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Ahorra tiempo haciendo check-in/out
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" action="#" method="POST">
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Usuario
                </label>
                <div className="mt-2">
                  <input
                    id="user"
                    name="user"
                    type="text"
                    defaultValue={data.user}
                    onChange={(e) => setData({ ...data, user: e.target.value })}
                    autoComplete="user"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Contraseña
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    defaultValue={data.password}
                    onChange={(e) => setData({ ...data, password: e.target.value })}
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="otp" className="block text-sm font-medium leading-6 text-gray-900">
                  One Time Password
                </label>
                <div className="mt-2">
                  <input
                    id="otp"
                    name="otp"
                    type="password"
                    defaultValue={data.otp}
                    onChange={(e) => setData({ ...data, otp: e.target.value })}
                    autoComplete="current-otp"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                {/* checkbox for wfh */}
                <div className="flex items-center justify-between">
                  <label class="inline-flex items-center me-5 cursor-pointer">
                    <input type="checkbox" value="" class="sr-only peer" checked={data.wfh} onChange={(e) => setData({ ...data, wfh: e.target.checked })} />
                    <div class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                    <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Trabajo desde casa</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label class="inline-flex items-center me-5 cursor-pointer">
                  <input type="checkbox" value="" class="sr-only peer" checked={advanced} onChange={(e) => setAdvanced(e.target.checked)} />
                  <div class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                  <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Configuración avanzada</span>
                </label>
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    defaultChecked={rememberMe}
                    onChange={(e) => rememberMeHandler(e)}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
                  />
                  <label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-gray-900">
                    Recordarme
                  </label>
                </div>
              </div>
              {advanced && (
                <div>
                  <label htmlFor="backend" className="block text-sm font-medium leading-6 text-gray-900">
                    Backend URL <span className="text-gray-500" onClick={(e) => { e.preventDefault(); setShowModal(true) }}>[?]</span>
                  </label>
                  {showModal && (
                    <div id="default-modal" tabIndex="-1" aria-hidden="true" class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 w-full max-w-2xl max-h-full">
                        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                          <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                              ¿Por qué necesito usar una Backend URL y que es?
                            </h3>
                            <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                              </svg>
                              <span class="sr-only" onClick={() => setShowModal(false)}>Close modal</span>
                            </button>
                          </div>
                          <div class="p-4 md:p-5 space-y-4">
                            <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                              No puedo hacer peticiones al portal si no estoy usando la misma URL que él. Por eso, necesito usar un backend custom para poder hacer peticiones al portal desde otro dominio diferente. Cambia el Referer que hay en las cabeceras para así evitar el CORS del navegador.
                            </p>
                            <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                              Además, la API hace todas las peticiones necesarias para fichar seguidas y te devuelve la respuesta. De esta manera, puedes hacer peticiones al portal sin tener que esperar la respuesta de iniciar sesión, el 2FA, hacer click en Fichajes... En este caso, el backend por defecto es <code>https://portal2api.mavs.dev/</code>.
                            </p>
                            <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                              <b>Puedes y debes usar el que quieras.</b> No me hago responsable de lo que pase si usas una API de terceros. Si quieres montarte tu propio backend, en <a href="https://github.com/JMavs/portal2-api" class="text-green-600 hover:text-green-500">portal2-api</a> tienes un ejemplo de como montarte lo mismo que hay en <code>https://portal2api.mavs.dev/</code>.
                            </p>
                          </div>
                          <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                            <button data-modal-hide="default-modal" onClick={() => setShowModal(false)} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Cerrar</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="mt-2">
                    <input
                      id="backend"
                      name="backend"
                      type="text"
                      defaultValue={data.backend}
                      onChange={(e) => setData({ ...data, otp: e.target.value })}
                      autoComplete="current-otp"
                      placeholder='https://portal2api.mavs.dev/'
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              )}

              <div>
                <button
                  onClick={(e) => { handleSubmit(e) }}
                  type="submit"
                  className={`flex w-full justify-center rounded-md bg-${color}-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-${color}-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-${color}-600`}
                >
                  {data.token === '' ? 'Login' : checked ? 'Check-out' : 'Check-in'}
                  { }
                </button>
              </div>
            </form>

            <div className="mt-6">
              <Timeline timeline={timeline} />
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            ¿Quieres ver el código fuente?{' '}
            <a href="https://github.com/jmavs/portal2" className="font-semibold leading-6 text-green-600 hover:text-green-500">
              Ojea el repositorio
            </a>
          </p>
        </div>
      </div>
    </>
  )
}



export default App;
