"use strict";
exports.__esModule = true;
function addEle(stale, ele, _type) {
    if (!stale)
        return;
    if (stale[_type])
        stale[_type].push(ele);
    else if (ele)
        stale[_type] = [ele];
}
function removeEle(stale, position, _type) {
    if (stale[_type] && position < stale[_type].length && position >= 0) {
        stale[_type].splice(position, 1);
    }
}
function moveEle(stale, source_idx, target_idx, _type) {
    if (stale[_type] && stale[_type].length > target_idx && stale[_type].length > source_idx && source_idx >= 0 && target_idx >= 0) {
        var tmp = stale[_type][target_idx];
        stale[_type][target_idx] = stale[_type][source_idx];
        stale[_type][source_idx] = tmp;
    }
}
function arraysEqual(a, b) {
    if (a === b)
        return true;
    if (a == null || b == null)
        return false;
    if (a.length !== b.length)
        return false;
    for (var i = 0; i < a.length; ++i) {
        if (a[i].file !== b[i].file || a[i].customType != b[i].customType)
            return false;
    }
    return true;
}
function checkValidTransform(transformed, latest) {
    var temp = arraysEqual(transformed.video, latest.video) && arraysEqual(transformed.audio, latest.audio)
        && arraysEqual(transformed.image, latest.image) && arraysEqual(transformed.other, latest.other);
    // console.log('Transformed : ', transformed, 'Latest : ', latest);
    return temp;
}
function isValid(stale, latest, transform) {
    // this is the part you write!
    for (var i = 0; i < transform.length; i++) {
        switch (transform[i].state) {
            case 'Insert': {
                addEle(stale, transform[i].fileObj, transform[i].type);
                break;
            }
            case 'Move': {
                moveEle(stale, transform[i].position, transform[i].secondPosition, transform[i].type);
                break;
            }
            case 'Delete': {
                removeEle(stale, transform[i].position, transform[i].type);
                break;
            }
        }
    }
    console.log(checkValidTransform(stale, latest));
}
isValid({
    video: [
        { file: '1.mp4', customType: 'video' },
        { file: '2.mp4', customType: 'video' },
        { file: '3.mp4', customType: 'video' }
    ]
}, {
    video: [
        { file: '2.mp4', customType: 'video' },
        { file: '1.mp4', customType: 'video' }
    ],
    image: [{ file: '1.png', customType: 'image' }]
}, [
    { state: 'Move', position: 0, secondPosition: 2, type: 'video' },
    {
        state: 'Insert',
        fileObj: { file: '1.png', customType: 'image' },
        type: 'image'
    },
    {
        state: 'Delete',
        position: 0,
        type: 'video'
    }
]); // true
isValid({}, {
    video: [
        { file: '1.mov', customType: 'video' },
        { file: '2.mov', customType: 'video' }
    ],
    image: [
        { file: '1.png', customType: 'image' },
        { file: '2.png', customType: 'image' },
        { file: '3.png', customType: 'image' }
    ]
}, [
    {
        state: 'Insert',
        fileObj: { file: '1.png', customType: 'image' },
        type: 'image'
    },
    {
        state: 'Insert',
        fileObj: { file: '1.mp3', customType: 'audio' },
        type: 'audio'
    },
    {
        state: 'Insert',
        fileObj: { file: '1.mov', customType: 'video' },
        type: 'video'
    },
    {
        state: 'Delete',
        position: 0,
        type: 'video'
    },
    {
        state: 'Insert',
        fileObj: { file: '2.png', customType: 'image' },
        type: 'image'
    },
    {
        state: 'Insert',
        fileObj: { file: '3.png', customType: 'image' },
        type: 'image'
    },
    {
        state: 'Insert',
        fileObj: { file: '2.mov', customType: 'video' },
        type: 'video'
    },
    {
        state: 'Move',
        position: 2,
        secondPosition: 1,
        type: 'video'
    }
]); // false
/***
 * Three reasons why
 * Audio not there
 * Video not deleted
 * Images not moved
 */
isValid({
    video: [
        { file: '1.mp4', customType: 'video' },
        { file: '2.mp4', customType: 'video' },
        { file: '3.mp4', customType: 'video' }
    ],
    image: [{ file: '1.png', customType: 'image' }]
}, {
    video: [
        { file: '3.mp4', customType: 'video' },
        { file: '1.mp4', customType: 'video' }
    ],
    image: [
        { file: '1.png', customType: 'image' },
        { file: '2.png', customType: 'image' }
    ]
}, [
    { state: 'Move', position: 0, secondPosition: 2, type: 'video' },
    {
        state: 'Insert',
        fileObj: { file: '2.png', customType: 'image' },
        type: 'image'
    },
    {
        state: 'Delete',
        position: 1,
        type: 'video'
    },
    {
        state: 'Insert',
        fileObj: { file: '3.png', customType: 'image' },
        type: 'image'
    },
    {
        state: 'Delete',
        position: 1,
        type: 'image'
    }
]); // false, wrong image deletion
