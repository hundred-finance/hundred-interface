import { useEffect, useRef } from 'react';
import { useGlobalContext } from "../../Types/globalContext"

const useHndPrice = async ()  => {
    const timeoutId = useRef<string | number | NodeJS.Timeout | undefined>();
    const {setHndPrice, setTerraUsd} = useGlobalContext()

    useEffect(() => {
      
      const updatePrice = async () => {
        if(timeoutId) clearTimeout((Number(timeoutId.current)))
        try{
          const url =  "https://api.coingecko.com/api/v3/simple/price?ids=terrausd%2Chundred-finance&vs_currencies=usd"
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
          const terra = data ? data["terrausd"] : null
          
          const hundred: number = hnd ? +hnd.usd : 0
          const ust: number = terra ? +terra.usd: 0
            
          setHndPrice(hundred)
          setTerraUsd(ust)
        }
        catch(err){
          console.log(err)
        }
        finally{
          const id = setTimeout(updatePrice, 60000)
          timeoutId.current = id
        }
      }
      
      updatePrice()
      return () => clearTimeout(Number(timeoutId.current));
    }, [])
  }

  export default useHndPrice