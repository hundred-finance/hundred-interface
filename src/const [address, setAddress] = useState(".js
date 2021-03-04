const [address, setAddress] = useState("")
const [balance, setBalance] = useState("0")
const [provider, setProvider] = useState(null)
const [pct, setPct] = useState("")
const [connected, setConnected] = useState(false)
const [pctEarned, setPctEarned] = useState("0")
const cookies = new Cookies()


const getPctBalance = async () => {
  const contract = new ethers.Contract(PCT_ADDRESS, PCT_ABI, provider)
  return {
    pct_balance : await contract.balanceOf(address),
    decimals : await contract.decimals(),
    symbol : await contract.symbol()
  }
}

const getPctEarned = async () => {
  const contract = new ethers.Contract(COMPOUND_LENS_ADDRESS, COMPOUNT_LENS_ABI, provider)
  const temp = await contract.getCompBalanceMetadata(PCT_ADDRESS, address)
  console.log(temp)
}

const ConnectButton = async () => {
  if(!connected){
    try {
      await window.ethereum.enable()
      const prov = new ethers.providers.Web3Provider(window.ethereum)
      setProvider(prov)
      setConnected(true)
      cookies.set('hundred-connected', "true")
    }
    catch (err){
      console.log(err)
    }
  }
  else{
    setAddress("")
    setBalance("")
    setProvider(null)
    setPct("")
    setConnected(false)
    cookies.set('hundred-connected', "false")
  }
}

useEffect(() => {
  const handleCookie = async () => {

    var conn = cookies.get('hundred-connected')

    console.log("Cookies: " + conn)
    if (conn === "true"){
      console.log("execute conn")
      try {
        await window.ethereum.enable()
        const prov = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(prov)
        setConnected(true)
      }
      catch (err){
        console.log(err)
      }
    }
  }
  handleCookie()
},[])

useEffect (()=>{
  const GetAccount= async () => {
    if(provider !== null){
      var account = await provider.listAccounts()

      if (account && account.length > 0){
        setAddress(account[0])
      }
    }
  }

  GetAccount()
},[provider])

useEffect(()=>{
  const GetBalances = async () => {
    if(address !== ""){
      var bal = ethers.utils.formatEther(await provider.getBalance(address))
      setBalance(bal)

      var pct_temp = await getPctBalance()
      setPct(pct_temp)
      getPctEarned()
    }
  }

  GetBalances()
}, [address])