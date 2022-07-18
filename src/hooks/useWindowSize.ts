import { useEffect, useState } from "react"

const getWidth = () => window.innerWidth 
  || document.documentElement.clientWidth 
  || document.body.clientWidth;

const useWindowSize = () => {
  const [width, setWidth] = useState(getWidth())

  useEffect(() => {
    // timeoutId for debounce mechanism
    let timeoutId: string | number | NodeJS.Timeout | undefined = undefined;
    const resizeListener = () => {
      // prevent execution of previous setTimeout
      clearTimeout(timeoutId);
      // change width from the state object after 20 milliseconds
      timeoutId = setTimeout(() => setWidth(getWidth()), 20);
    };
    // set resize listener
    window.onresize =  resizeListener;

    // clean up function
    return () => {
      // remove resize listener
      window.removeEventListener('resize', resizeListener);
    }
  }, [])

    // useEffect(() => {
    //     const updateSize = () => {
    //         if(show){
    //             if (window.innerWidth < (!hasClaimed ? 750 : 925)){
    //               setIsMobile(true)
    //               setIsTablet(false)
    //               if(window.innerWidth < 331)
    //                 setScale(true)
    //             }
    //             else if (window.innerWidth < (!hasClaimed ? 1064 : 1192)){
    //               setScale(false)
    //               setIsTablet(true)
    //               setIsMobile(false)
    //             }
    //             else {
    //                 setScale(false)
    //                 setIsTablet(false)
    //             }
    //           }
    //       }

    //     window.onresize = updateSize
    // }, [])

    return width
}

export default useWindowSize