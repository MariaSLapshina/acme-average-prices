const { Component } = React
    const { render } = ReactDOM
    const {Link, Route, Switch, Redirect, HashRouter} = ReactRouterDOM
    const root = document.querySelector('#root')
    
    const NavBar = () =>{
        return(
            <nav>
                <Link to ='/home' className ={location.hash.slice(1) === '/home'?'selected':''}>Home</Link>
                <Link to ='/products' className ={location.hash.slice(1) === '/products'?'selected':''}>Products</Link>
            </nav>
            )
    }
    const Home =({products}) => {
        
        const avg = Math.round(products.reduce((acc,product) => {
            acc+=product.suggestedPrice
            return acc},0)/products.length*100)/100

       // console.log('products is in HOME:',products)
        return(
            <div>
            <h2>Home</h2>
            <div>We have {products.length} products with an average price of {avg}</div>
            </div>
        )
        }
    const Products = ({products,offerings,companies}) => {
        const productPrices = products.map(product=>{
            return offerings.reduce((acc,offering)=>{
                if(product.id===offering.productId){
                    acc.push(offering.price)
                }
                return acc
                },[])
        })
       const pricesAvg = productPrices.reduce((acc,prices)=>{
           acc.push(prices.reduce((acc,price) => acc+=price,0)/prices.length)
           return acc
        },[])
        const minPrices = productPrices.reduce((acc,prices)=>{
           acc.push(Math.min(...prices))
           return acc
        },[])
        const minPriceCompanies = minPrices.map(curMin =>{
            return offerings.reduce((acc,offering) => {
                if(curMin === offering.price){
                    companies.map(company =>{
                        if(offering.companyId === company.id){
                            acc.push(company.name)
                        }
                    })
                
                }
                return acc
            },[])
        })

        //console.log(minPriceCompanies)
        return (
            <div>
            <h2>Products</h2>
            <ul>
                {products.map((product,idx) =><li key = {product.id}>
                <ul>
                    <li key = {1}><strong>Product:</strong> {product.name}</li>
                    <li key = {2}><strong>Suggested price:</strong> {product.suggestedPrice}</li>
                    <li key = {3}><strong>Average price:</strong> {Math.round(pricesAvg[idx]*100)/100}</li>
                    <li key = {4}><strong>Lowest price:</strong> {minPrices[idx]} offered by {minPriceCompanies[idx].join(', ')}</li>
                </ul>
                </li>)}
            </ul>
            </div>
        )
    }
    const getProducts = async () => {
        return (await axios.get('https://acme-users-api-rev.herokuapp.com/api/products')).data;
    }
    const getOfferings = async () => {
        return (await axios.get('https://acme-users-api-rev.herokuapp.com/api/offerings')).data;
    }
    const getCompanies = async () => {
        return (await axios.get('https://acme-users-api-rev.herokuapp.com/api/companies')).data;
    }
    class App extends Component{
        constructor({products,offerings,companies}){
            super()
            this.state = {
                products:[],
                offerings:[],
                companies:[]
            }
           
        }
        
        async componentDidMount() {
        //console.log('mounted!')
        const products = await getProducts()
        const offerings = await getOfferings()
        const companies = await getCompanies()
        this.setState({products,offerings,companies})
        }

        render(){
            //console.log('this is in RENDER:',this)
            
            const {products, offerings,companies} = this.state
            
            return (
                <div>
                <HashRouter> 
                    <h1>Acme Product Averages React</h1>
                    <Route render= {()=><NavBar/>}/>
                    <Switch>
                        <Route path = '/home' render = {() => <Home products = {products}/>}/>
                        <Route path = '/products' render = {() => <Products products = {products} offerings = {offerings} companies = {companies}/>}/>
                        <Redirect to = '/home' />
                    </Switch>
                </HashRouter>
                </div>
            )
        }
        
    }

    render(<App/>,root)