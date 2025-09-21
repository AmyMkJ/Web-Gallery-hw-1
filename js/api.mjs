/*  ******* Data types *******
    image objects must have at least the following attributes:
        - (String) imageId 
        - (String) title
        - (String) author
        - (String) url
        - (Date) date

    comment objects must have the following attributes
        - (String) commentId
        - (String) imageId
        - (String) author
        - (String) content
        - (Date) date

****************************** */

// add an image to the gallery
export function addImage(title, author, url) {
    const images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
    const newImage = {
        imageId : Date.now().toString() + Math.random().toString(36),
        title : title,
        author : author,
        url : url,
        date : new Date()
    }
    images.push(newImage);
    localStorage.setItem('galleryImages',JSON.stringify(images));
    return newImage;
}

// delete an image from the gallery given its imageId
export function deleteImage(imageId) {
    const images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
    const comments = JSON.parse(localStorage.getItem('galleryComments') || '[]');
    const updatedImages = images.filter(function(img) {
        return img.imageId !== imageId;
    });
    localStorage.setItem('galleryImages', JSON.stringify(updatedImages));
    const updatedComments = comments.filter(function(comment) {
        return comment.imageId !== imageId;
    });
    localStorage.setItem('galleryComments',JSON.stringify(updatedComments));
    return updatedImages;
}

// add a comment to an image
export function addComment(imageId, author, content) {
    const comments = JSON.parse(localStorage.getItem('galleryComments') || '[]');
    const newComment = {
        commentId : Date.now().toString() + Math.random().toString(36),
        imageId : imageId,
        author: author,
        content: content,
        date: new Date()
    }
    comments.push(newComment);
    localStorage.setItem('galleryComments',JSON.stringify(comments));
    return newComment;
}

// delete a comment to an image
export function deleteComment(commentId) {
    const comments = JSON.parse(localStorage.getItem('galleryComments') || '[]');
    const updatedComments = comments.filter(function(comment) {
        return comment.commentId !== commentId;
    });
    localStorage.setItem('galleryComments',JSON.stringify(updatedComments));
    return updatedComments;
}

