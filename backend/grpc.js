const PROTO_PATH = __dirname + '/proto/basic_api.proto';

const setup = require(__dirname + '/src/class/setup');

const fs = require('fs');
const chunkingStreams = require('chunking-streams');
const SizeChunker = chunkingStreams.SizeChunker;
const SeparatorChunker = chunkingStreams.SeparatorChunker;
const LineCounter = chunkingStreams.LineCounter;

const protobuf = requite('protobufjs')


const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const { response } = require('express');
// const { mainModule } = require('process');

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
const filePath = __dirname + '/files/test.csv'
const input = fs.createReadStream(filePath)



uploadFile = async()=> {
    let route = Buffer.from('/hv_demo/repo/internship_demo','utf-8');
    let param = Buffer.from(JSON.stringify({
        action: 'updateRepo',
        parameter: {
            repoId: '0',
            meta: {
                user: 'HiVi',
                name: '/hv_demo/repo/internship_demo',
                type: 'FILE',
                format: 'csv',
                label: 'test',
                extra_field_1: '',
                extra_field_2: ''
            }
        }
    }),'utf-8');

    // final data
    let fileBuffer = Buffer.concat([route,param]);
    chunker = new LineCounter({
        numLines: 1,
        flushTail: false
    });

    await client.upload_file({data:route},(err,response) => {
        if(err){
            return;
        }
        console.log(response)
        // client.upload_file({data:param},(err,response) => {
        //     if(err){
        //         return;
        //     }
        //     console.log(response)
        // })
    })

    

    // b = await client.upload_file({data:param})
    // b.on('data', message=> {
    //     console.log(message)
    // })
    // chunker.on('data',async chunk => {
    //     console.log(chunk.data.toString())
    //    await  client.upload_file({data:chunk.data},(err,res) => {
    //        try{
    //             if(err){
    //                 console.log(err);
    //             }
    //             console.log(res);
    //         }
    //         catch(err){
    //             console.log(err);
    //         }
    //      })
    // })

    
    











    
    // console.log(request.data)
    // try{
    //     await client.upload_file(request, (err,response)=> {
    //         if(error){
    //             console.log(err)
    //             return
    //         }
    //         console.log(response)
    //     })
    //    console.log(res)
    //     if(JSON.parse(res).action.code == '200'){
    //         chunker = new SizeChunker({
    //             chunkSize: 512,
    //             flushTail: true
    //         })
    //     }
    // }
    // catch(err){
    //     console.log(err)
    // }

    // chunker.on('data', (chunk) => {
    //     client.upload_file({ code: 1, data: chunk.data.toString() }, (err, response) => {
    //         console.log(response.code)
    //     })
    // })
    // input.pipe(chunker)
    // input.on('end', () => {
    //     client.upload_file({ code: 2, data: "" }, (err, response) => {
    //         console.log(response.code)
    //         input.close()
    //     })
    // })
}












/*
function main() {
    countActivity();
    listActivity();
    listRepo();
    listUser();
    getUserInfo();
    getCatalogInfo();
    registerUser();
}
main()
*/
