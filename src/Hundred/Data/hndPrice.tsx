import { useEffect, useState } from "react"
import { useGlobalContext } from "../../Types/globalContext"

const useHndPrice = async ()  => {
    const [timeoutId, setTimeoutId] = useState<string | number | NodeJS.Timeout | undefined>()
    const {setHndPrice} = useGlobalContext()

    useEffect(() => {
      
      const updatePrice = async () => {
        if(timeoutId) clearTimeout(timeoutId)
        try{
          const url =  "https://api.coingecko.com/api/v3/simple/price?ids=hundred-finance&vs_currencies=usd"
          const headers = {}
          const response = await fetch(url,
              {
                  method: "GET",
                  mode: 'cors',
                  headers: headers
              }
            )
          const data = await response.json()
          const hnd = data ? data["hundred-finance"] : null
          const usd: number = hnd ? +hnd.usd : 0
            console.log("Price: " + hnd.usd)
          setHndPrice(usd)
        }
        catch(err){
          console.log(err)
        }
        finally{
          const id = setTimeout(updatePrice, 60000)
          setTimeoutId(id)
        }
      }
      
      updatePrice()

      return () => clearTimeout(timeoutId)
    }, [])
  }

  export default useHndPrice