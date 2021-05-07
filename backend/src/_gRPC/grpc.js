// Proto path
const PROTO_PATH = 'src/_gRPC/proto/basic_api.proto';

// Upload chunking stream
const fs = require('fs');
const chunkingStreams = require('chunking-streams');
const SizeChunker = chunkingStreams.SizeChunker;

// gRPC
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const { resolve } = require('path');

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
systemLog = (request) =>{
    // let request = new setup (
    //     'SystemLog',
    //     'countActivity',
    //     {}
    // }
    return new Promise( (resolve,reject) => {
        client.setup(request.toRequest(),(err, response) => {
            if(err){
                reject(err)
                return;
            }
            resolve(response)
        })
    })
};

// // 2
// listActivity = (request) =>{
//     // let request = new setup (
//     //     'SystemLog',
//     //     'listActivity',
//     //     {}
//     // )
//     return new Promise( (resolve,reject) => {
//         client.setup(request.toRequest(),(err, response) => {
//             if(err){
//                 reject(err)
//                 return;
//             }
//             resolve(response)
//         })
//     })
// };

// // 3
// listRepo = (request) =>{
//     // let request = new setup (
//     //     'SystemLog',
//     //     'listRepo',
//     //     {}
//     // )
//     return new Promise( (resolve,reject) => {
//         client.setup(request.toRequest(),(err, response) => {
//             if(err){
//                 reject(err)
//                 return;
//             }
//             resolve(response)
//         })
//     })
// };

// // 4
// listUser = (request) =>{
//     // let request = new setup (
//     //     'SystemLog',
//     //     'listUser',
//     //     {}
//     // )
//     return new Promise( (resolve,reject) => {
//         client.setup(request.toRequest(),(err, response) => {
//             if(err){
//                 reject(err)
//                 return;
//             }
//             resolve(response)
//         })
//     })
// };

// // 5
// listCatalog  = (request) =>{
//     // let request = new setup (
//     //     'SystemLog',
//     //     'listCatalog',
//     //     {}
//     // )
//     return new Promise( (resolve,reject) => {
//         client.setup(request.toRequest(),(err, response) => {
//             if(err){
//                 reject(err)
//                 return;
//             }
//             resolve(response)
//         })
//     })
// };

// // 6
// getUserInfo = (request) =>{
//     // let request = new setup (
//     //     'SystemLog',
//     //     'getUserInfo',
//     //     {
//     //         name: 'HiVi'
//     //     }
//     // )
//     return new Promise( (resolve,reject) => {
//         client.setup(request.toRequest(),(err, response) => {
//             if(err){
//                 reject(err)
//                 return;
//             }
//             resolve(response)
//         })
//     })
// };

// // 7
// getCatalogInfo = (request) =>{
//     // let request = new setup (
//     //     'SystemLog',
//     //     'getCatalogInfo',
//     //     {
//     //         name: ''
//     //     }
//     // )
//     return new Promise( (resolve,reject) => {
//         client.setup(request.toRequest(),(err, response) => {
//             if(err){
//                 reject(err)
//                 return;
//             }
//             resolve(response)
//         })
//     })
// };

// // 8
// registerUser = (request) =>{
//     // let request = new setup (
//     //     'SystemLog',
//     //     'registerUser',
//     //     {
//     //         name: 'HiVi',
//     //         describe: ''
//     //     }
//     // );
        
//     return new Promise( (resolve,reject) => {
//         client.setup(request.toRequest(),(err, response) => {
//             if(err){
//                 reject(err)
//                 return;
//             }
//             resolve(response)
//         })
//     })
// };

// // 9
// registerCatalog = (request) =>{
//     // let request = new setup (
//     //     'SystemLog',
//     //     'registerCatalog',
//     //     {
//     //         name: 'HiVi',
//     //         describe: ''
//     //     }
//     // );
        
//     return new Promise( (resolve,reject) => {
//         client.setup(request.toRequest(),(err, response) => {
//             if(err){
//                 reject(err)
//                 return;
//             }
//             resolve(response)
//         })
//     })
// };


// // StorageManager

// //1
// createRepo = (request) =>{
//     // let request = new setup (
//     //     'StorageManager',
//     //     'createRepo',
//     //     {
//     //         path: '/hv_demo/repo/internship_demo',
//     //         schema: {
//     //             fields: [],
//     //             describe: '',
//     //             type: 'DIR', // FILE or DIR
//     //             status: '',
//     //             notes: ''
//     //         }
//     //     }
//     // );
        
//     return new Promise( (resolve,reject) => {
//         client.setup(request.toRequest(),(err, response) => {
//             if(err){
//                 reject(err)
//                 return;
//             }
//             resolve(response)
//         })
//     })
// };


//2



// const stat = fs.statSync(uploadPath)
// const size = stat.size
// const blocks = size/defaultSize
 

uploadFile = (request) => {
    const uploadPath = `src/cache/upload/${request.name}.${request.type}`
    const input = fs.createReadStream(uploadPath)
    const defaultSize = 1024 * 256

    let route = Buffer.from('StorageManager','utf-8');
    let param = Buffer.from(JSON.stringify({
        action: 'updateRepo',
        parameter: {
            repoId: '0',
            meta: {
                user: 'HiVi',
                name: request.name,
                type: 'FILE',
                format: request.type,
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
// searchStorage = async() => {
//     let request = new setup (
//         'FileQuery',
//         'searchStorage',
//         {
//             repoId: '0',
//             expr: {
//                 // path: '/hv_demo/repo/internship_demo/data/1601364735836.HiVi.test2.csv.bin'
//                 // select: [],
//                 // where: [],
//                 // order_by: {},
//                 // limit: ''
//             }
//         }
//     )
//     try {
//         await client.setup(request.toRequest(), (error, response) => {
//             if(error){
//                 console.log(error);
//                 return;
//             }

//             console.log(JSON.parse(response.result))
//         });
//     }
//     catch(err){
//         console.log(err)
//     }
// }



//2
downloadFile = (request)=> {
    const downloadPath = `src/cache/download/${request.name}.${request.type}`
    const output = fs.createWriteStream(downloadPath)

    let route = Buffer.from('FileQuery','utf-8');
    let param = Buffer.from(JSON.stringify({
        action: 'loadData',
        parameter: {
            path: `/hv_demo/repo/internship_demo/data/${request.path}`
    }}),'utf-8');

    return new Promise( (resolve, reject) => {
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
            reject(err)
            call.end();
        })
        
        call.on('end', ()=>{
            resolve(downloadPath)
            console.log('The stream has ended!');
        })

        call.write({data:route})
    })
    
}


module.exports = {
    systemLog,
    // countActivity,      //1
    // listActivity,       //2
    // listRepo,           //3
    // listUser,           //4
    // listCatalog,        //5
    // getUserInfo,        //6
    // getCatalogInfo,     //7
    // createRepo,         //8
    // registerUser,       //9
    // registerCatalog,    //10
    uploadFile,         //11
    // searchStorage,      //12
    downloadFile        //13
}
