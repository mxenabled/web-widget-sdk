export const wait = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

export const waitFor = (fn: () => boolean, delay = 100) =>
  new Promise((resolve) => {
    const aux = async () => {
      if (fn()) {
        resolve(true)
      } else {
        await wait(delay)
        aux()
      }
    }

    aux()
  })
