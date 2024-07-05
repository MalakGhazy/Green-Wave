export class ApiFeatures{
    constructor(mongooseQuery,queryData){
        this.mongooseQuery=mongooseQuery
        this.queryData=queryData
    }

    //Pagination
    pagination =(model)=>{
        let{page,size}=this.queryData;
        if(!size||size<=0) size = 5
        if(!page||page<=0) page = 1
        let num = size*(page-1)
        this.mongooseQuery.skip(num).limit(size)
        model.countDocuments(/* condition return the number of matched objects */)
        .then((value)=>{
            this.queryData.count=value
            this.queryData.totalPages=Math.ceil(value/size)
            if(this.queryData.totalPages>page){
                this.queryData.next=Number(page+1)
            }
            if(page>1){
                this.queryData.previous=Number(page-1)
            }
            this.queryData.count= value
        })
        return this
    }

    filter=() =>{
        const excludedQuery = ['page','size','sort','searchkey','fields']
        let filterQuery={...this.queryData}
        excludedQuery.forEach(ele => {
            delete filterQuery[ele]
        })
        filterQuery=JSON.parse(JSON.stringify(filterQuery).replace(/gt|gte|lt|ite/g,(match)=>`$${match}`))
        this.mongooseQuery.find(filterQuery)
        return this
    }

    sort=()=>{
        /*this.queryData.sort=this.queryData.sort?.replace(/,/g,' ')
        this.mongooseQuery.find(filterQuery)*/
        if (this.queryData.sort) {
            const sortBy = this.queryData.sort.replace(/,/g, ' ');
            this.mongooseQuery.sort(sortBy);
        }
        return this
    }

    search=()=>{
        if(this.queryData.searchkey){
            this.mongooseQuery.find({
                $or:[
                    {name:{$regex:this.queryData.searchkey}},
                    {description:{$regex:this.queryData.searchkey}}
                ]
            })
        }
        return this
    }

    select = ()=>{
        this.queryData.fields=this.queryData.fields?.replace(/,/g,' ')
        this.mongooseQuery.select(this.queryData.fields)
        return this
    }
}