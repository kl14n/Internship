const PROTO_PATH = __dirname + '/proto/basic_api.proto';

const setup = require(__dirname + '/src/class/setup');

const fs = require('fs');
const chunkingStreams = require('chunking-streams');
const SizeChunker = chunkingStreams.SizeChunker;

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
countActivity = async() =>{
    let request = new setup (
        'SystemLog',
        'countActivity',
        {}
    )
    try {
        await client.setup(request.setupToRequest(), (error, response) => {
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
        await client.setup(request.setupToRequest(), (error, response) => {
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
        await client.setup(request.setupToRequest(), (error, response) => {
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
        await client.setup(request.setupToRequest(), (error, response) => {
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
        await client.setup(request.setupToRequest(), (error, response) => {
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
        await client.setup(request.setupToRequest(), (error, response) => {
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
        await client.setup(request.setupToRequest(), (error, response) => {
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
        await client.setup(request.setupToRequest(), (error, response) => {
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
        await client.setup(request.setupToRequest(), (error, response) => {
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
        await client.setup(request.setupToRequest(), (error, response) => {
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
const filePath = __dirname + `/files/${fileName}.csv`
const input = fs.createReadStream(filePath);
const stat = fs.statSync(filePath)
const size = stat.size;
const defaultSize = 1024 * 256
const blocks = size/defaultSize


uploadFile = async()=> {
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
                console.log(id*100.0/blocks, '%');
                done();
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












function main() {
    countActivity();
    listActivity();
    listRepo();
    listUser();
    getUserInfo();
    getCatalogInfo();
    registerUser();
    registerCatalog();
    uploadFile()
}

main()
