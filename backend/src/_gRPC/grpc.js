// Proto path
const PROTO_PATH = __dirname + '/proto/basic_api.proto';

// Class
const setup = require(__dirname + '/class/setup');

// Upload chunking stream
const fs = require('fs');
const chunkingStreams = require('chunking-streams');
const SizeChunker = chunkingStreams.SizeChunker;

// gRPC
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
const storageManager = grpc.loadPackageDefinition(packageDefinition).com.usth.hieplnc.api.grpc.basic;

const client = new storageManager.StorageManager('localhost:50050', grpc.credentials.createInsecure());


// System Log

// 1
countActivity = async(request) =>{
    
    try {
        await client.setup(request.toRequest(), (error, response) => {
            if(error){
                console.log(error);
                return;
            }
            console.log(response);
        });
    }
    catch(err){
        console.log(err)
    }
};

// 2
listActivity = async() =>{
    let request = new setup (
        'SystemLog',
        'listActivity',
        {}
    )
    try {
        await client.setup(request.toRequest(), (error, response) => {
            if(error){
                console.log(error);
                return;
            }
            console.log(response);
        });
    }
    catch(err){
        console.log(err)
    }
};

// 3
listRepo = async() =>{
    let request = new setup (
        'SystemLog',
        'listRepo',
        {}
    )
    try {
        await client.setup(request.toRequest(), (error, response) => {
            if(error){
                console.log(error);
                return;
            }
            console.log(response);
        });
    }
    catch(err){
        console.log(err)
    }
};

// 4
listUser = async() =>{
    let request = new setup (
        'SystemLog',
        'listUser',
        {}
    )
    try {
        await client.setup(request.toRequest(), (error, response) => {
            if(error){
                console.log(error);
                return;
            }
            console.log(response);
        });
    }
    catch(err){
        console.log(err)
    }
};

// 5
listCatalog  = async() =>{
    let request = new setup (
        'SystemLog',
        'listCatalog',
        {}
    )
    try {
        await client.setup(request.toRequest(), (error, response) => {
            if(error){
                console.log(error);
                return;
            }
            console.log(response);
        });
    }
    catch(err){
        console.log(err)
    }
};

// 6
getUserInfo = async() =>{
    let request = new setup (
        'SystemLog',
        'getUserInfo',
        {
            name: 'HiVi'
        }
    )
    try {
        await client.setup(request.toRequest(), (error, response) => {
            if(error){
                console.log(error);
                return;
            }
            console.log(response);
        });
    }
    catch(err){
        console.log(err)
    }
};

// 7
getCatalogInfo = async() =>{
    let request = new setup (
        'SystemLog',
        'getCatalogInfo',
        {
            name: ''
        }
    )
    try {
        await client.setup(request.toRequest(), (error, response) => {
            if(error){
                console.log(error);
                return;
            }
            console.log(response);
        });
    }
    catch(err){
        console.log(err)
    }
};

// 8
registerUser = async() =>{
    let request = new setup (
        'SystemLog',
        'registerUser',
        {
            name: 'HiVi',
            describe: ''
        }
    );
        
    try {
        await client.setup(request.toRequest(), (error, response) => {
            if(error){
                console.log(error);
                return;
            }
            console.log(response);
        });
    }
    catch(err){
        console.log(err)
    }
};

// 9
registerCatalog = async() =>{
    let request = new setup (
        'SystemLog',
        'registerCatalog',
        {
            name: 'HiVi',
            describe: ''
        }
    );
        
    try {
        await client.setup(request.toRequest(), (error, response) => {
            if(error){
                console.log(error);
                return;
            }
            console.log(response);
        });
    }
    catch(err){
        console.log(err)
    }
};


// StorageManager

//1
createRepo = async() =>{
    let request = new setup (
        'StorageManager',
        'createRepo',
        {
            path: '/hv_demo/repo/internship_demo',
            schema: {
                fields: [],
                describe: '',
                type: 'DIR', // FILE or DIR
                status: '',
                notes: ''
            }
        }
    );
        
    try {
        await client.setup(request.toRequest(), (error, response) => {
            if(error){
                console.log(error);
                return;
            }
            console.log(response);
        });
    }
    catch(err){
        console.log(err)
    }
};


//2
const fileName = 'test2'
const uploadPath = __dirname + `/data/upload/${fileName}.csv`
const input = fs.createReadStream(uploadPath)
const defaultSize = 1024 * 256


// const stat = fs.statSync(uploadPath)
// const size = stat.size
// const blocks = size/defaultSize
 

uploadFile = ()=> {
    let route = Buffer.from('StorageManager','utf-8');
    let param = Buffer.from(JSON.stringify({
        action: 'updateRepo',
        parameter: {
            repoId: '0',
            meta: {
                user: 'HiVi',
                name: fileName,
                type: 'FILE',
                format: 'csv',
                label: 'HiVi'
            }
    }}),'utf-8');

    let call = client.upload_file();

    call.on('data', (response) => {
        let res = JSON.parse(response.data.toString());
        console.log(res);

        if(res.action.status == 'service state: 1'){
            chunker = new SizeChunker({
                chunkSize: defaultSize,
                flushTail: true
            })
            
            chunker.on('data', chunk => {
                call.write({data:chunk.data})
            })

            chunker.on('chunkEnd', (id, done) => {
                done()
            })

            input.on('end',() => {
                call.end();
            })

            input.pipe(chunker)
        }
    })

    call.on('error', (err) => {
        console.log(err);
        call.end();
    })
    
    call.on('end', ()=>{
        console.log('The stream has ended!');
    })

    call.write({data:route})
    call.write({data:param})
}

// FileQuery

//1
searchStorage = async() => {
    let request = new setup (
        'FileQuery',
        'searchStorage',
        {
            repoId: '0',
            expr: {
                // path: '/hv_demo/repo/internship_demo/data/1601364735836.HiVi.test2.csv.bin'
                // select: [],
                // where: [],
                // order_by: {},
                // limit: ''
            }
        }
    )
    try {
        await client.setup(request.toRequest(), (error, response) => {
            if(error){
                console.log(error);
                return;
            }
            console.log(response);
            console.log(JSON.parse(response.result))
        });
    }
    catch(err){
        console.log(err)
    }
}



//2

const downloadPath = __dirname + `/data/download/test3`
const output = fs.createWriteStream(downloadPath)

downloadFile = ()=> {
    let route = Buffer.from('FileQuery','utf-8');
    let param = Buffer.from(JSON.stringify({
        action: 'loadData',
        parameter: {
            path: `/hv_demo/repo/internship_demo/data/1601357423390.HiVi.test.csv.bin`
    }}),'utf-8');

    let call = client.download_file();
    let state = 0;

    call.on('data', (response) => {

        if(state == 0) {
            let res = JSON.parse(response.data.toString());
            if(res.action.code == '200'){
                state++;
                call.write({data:param});
            } else{
                call.end()
            }
        } else if(state == 1) {
            let res = JSON.parse(response.data.toString());
            if(res.action.code == '200'){
                state++;
                call.write({data: Buffer.from('200')});
            } else{
                call.end();
            }
        } else {
            output.write(response.data)
        }
    })

    call.on('error', (err) => {
        console.log(err);
        call.end();
    })
    
    call.on('end', ()=>{
        console.log('The stream has ended!');
    })

    call.write({data:route})
}


module.exports = {
    countActivity,      //1
    listActivity,       //2
    listRepo,           //3
    listUser,           //4
    listCatalog,        //5
    getUserInfo,        //6
    getCatalogInfo,     //7
    createRepo,         //8
    registerUser,       //9
    registerCatalog,    //10
    uploadFile,         //11
    searchStorage,      //12
    downloadFile        //13
}