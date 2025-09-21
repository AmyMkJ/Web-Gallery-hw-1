import { addImage, deleteImage, addComment, deleteComment } from './api.mjs';

let currentImageIndex = 0; // index of the current image
let currentCommentPage = 0; // index of the current comment page
let images = []; // array of images

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// initialize the app when DOM is loaded
function initializeApp(){
    loadImages();
    setupEventListeners();
    updateImageDisplay();
}

// load images from localStorage
function loadImages(){
    images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
}

// validate URL format
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// setup event listeners
function setupEventListeners(){
    document.getElementById('toggle-add-form').addEventListener('click', toggleAddForm);
    document.getElementById('image-form').addEventListener('submit', addImageSubmit);
    document.getElementById('cancel-add').addEventListener('click',hideAddForm);
    document.getElementById('prev-image').addEventListener('click',showPreviousImage);
    document.getElementById('next-image').addEventListener('click',showNextImage);
    document.getElementById('delete-image').addEventListener('click',deleteCurrentImage);
    document.getElementById('comment-form').addEventListener('submit', handleCommentSubmit);
    document.getElementById('prev-comments').addEventListener('click', showPreviousComments);
    document.getElementById('next-comments').addEventListener('click', showNextComments);
}

// toggle the add image form
function toggleAddForm(){
    const form = document.getElementById('add-image-form');
    const galleryDisplay = document.getElementById('gallery-display');
    
    form.classList.toggle('hidden');
    
    if (!form.classList.contains('hidden')) {
        galleryDisplay.classList.add('hidden');
        document.getElementById('image-form').reset();
    } else {
        if (images.length > 0) {
            galleryDisplay.classList.remove('hidden');
        }
    }
}

// handle the add image submit
function addImageSubmit(event){
    event.preventDefault();
    const title = document.getElementById('image-title').value.trim();
    const author = document.getElementById('image-author').value.trim();
    const url = document.getElementById('image-url').value.trim();
    
    if (!title || !author || !url) {
        alert('Please fill in all fields');
        return;
    }
    
    if (!isValidUrl(url)) {
        alert('Please enter a valid URL');
        return;
    }
    
    addImage(title, author, url);
    
    loadImages();
    
    showImage(images.length - 1);
    
    hideAddForm();
}

// show the gallery
function showGallery(){
    document.getElementById('empty-gallery').classList.add('hidden');
    document.getElementById('gallery-display').classList.remove('hidden');
    document.getElementById('delete-image').classList.remove('hidden');
}

// show the image
function showImage(index){
    showGallery();
    currentImageIndex = index;
    const image = images[currentImageIndex];
    
    const imgElement = document.getElementById('current-image');
    imgElement.src = image.url;
    imgElement.alt = image.title;
    
    document.getElementById('image-title-display').textContent = image.title;
    document.getElementById('image-author-display').textContent = image.author;
    
    document.getElementById('image-counter').textContent = `${currentImageIndex + 1} of ${images.length}`;

    currentCommentPage = 0;
    updateCommentsDisplay();
}

// hide the add image form
function hideAddForm(){
    const form = document.getElementById('add-image-form');
    const galleryDisplay = document.getElementById('gallery-display');
    
    form.classList.add('hidden');
    
    if (images.length > 0) {
        galleryDisplay.classList.remove('hidden');
    }
}

// show the previous image
function showPreviousImage(){
    if (currentImageIndex > 0){
        showImage(currentImageIndex - 1);
    }
}

// show the next image
function showNextImage(){
    if (currentImageIndex < images.length - 1){
        showImage(currentImageIndex + 1);
    }
}

// delete the current image
function deleteCurrentImage(){
    if (images.length > 0){
        const imageId = images[currentImageIndex].imageId;
        
        deleteImage(imageId);
        
        loadImages();
        
        if (images.length === 0) {
            showEmptyGallery();
        } else {
            if (currentImageIndex >= images.length) {
                currentImageIndex = images.length - 1;
            }
            showImage(currentImageIndex);
        }
        
        updateCommentsDisplay();
    }
}

// update the image display
function updateImageDisplay(){
    if (images.length === 0){
        showEmptyGallery();
    } else {
        if (currentImageIndex >= images.length) {
            currentImageIndex = 0;
        }
        showImage(currentImageIndex);
    }
}

// show the empty gallery
function showEmptyGallery(){
    document.getElementById('empty-gallery').classList.remove('hidden');
    document.getElementById('gallery-display').classList.add('hidden');
    document.getElementById('delete-image').classList.add('hidden');
}

// handle the comment from submittion
function handleCommentSubmit(event){
    event.preventDefault();
    const author = document.getElementById('comment-author').value.trim();
    const content = document.getElementById('comment-content').value.trim();
    
    if (!author || !content) {
        alert('Please fill in all fields');
        return;
    }
    
    if (images.length === 0) {
        alert('No images available. Please add an image first before commenting.');
        return;
    }
    
    if (images.length > 0){
        const currentImageId = images[currentImageIndex].imageId;
        addComment(currentImageId, author, content);
        document.getElementById('comment-form').reset();
        updateCommentsDisplay();
    }
}

// show the previous comments
function showPreviousComments(){
    if (images.length === 0) {
        alert('No images available. Please add an image first before viewing comments.');
        return;
    }
    
    const currentImageId = images[currentImageIndex].imageId;
    const comments = getCommentsForImage(currentImageId);
    
    if (comments.length === 0) {
        alert('No comments available for this image.');
        return;
    }
    
    if (currentCommentPage > 0) {
        currentCommentPage--;
        updateCommentsDisplay();
    }
}

// show the next comments
function showNextComments(){
    if (images.length === 0) {
        alert('No images available. Please add an image first before viewing comments.');
        location.reload();
        return;
    }
    
    const currentImageId = images[currentImageIndex].imageId;
    const comments = getCommentsForImage(currentImageId);
    
    if (comments.length === 0) {
        alert('No comments available for this image.');
        return;
    }
    
    currentCommentPage++;
    updateCommentsDisplay();
}

// update the comments display
function updateCommentsDisplay(){
    if (images.length > 0){
        const currentImageId = images[currentImageIndex].imageId;

        const comments = getCommentsForImage(currentImageId);
        const startIndex = currentCommentPage * 10;
        const endIndex = startIndex + 10;
        const pageComments = comments.slice(startIndex, endIndex);

        displayComments(pageComments);

        updateCommentsCounter(comments.length, startIndex, endIndex);

        updateCommentNavigation(comments.length);
    } else {
        // if there are no images, clear the comments display
        displayComments([]);
        updateCommentsCounter(0, 0, 0);
        updateCommentNavigation(0);
    }
}
// get the comments for the current image
function getCommentsForImage(imageId){
    const comments = JSON.parse(localStorage.getItem('galleryComments') || '[]');
    return comments.filter(comment => comment.imageId === imageId)
                  .sort((a, b) => new Date(b.date) - new Date(a.date));
}
// update the comments counter
function updateCommentsCounter(totalComments, startIndex, endIndex){
    const counter = document.getElementById('comments-counter');
    if (totalComments === 0) {
        counter.textContent = 'No comments';
    } else {
        counter.textContent = `${startIndex + 1}-${Math.min(endIndex, totalComments)} of ${totalComments}`;
    }
}
// display the comments
function displayComments(comments){
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';
    
    comments.forEach(comment => { 
        const commentElement = createCommentElement(comment);
        commentsList.appendChild(commentElement); 
    });
}

// create the comment element
function createCommentElement(comment){
    const div = document.createElement('div');
    div.className = 'comment-item';
    div.innerHTML = `
        <div class="comment-header">
            <span class="comment-author">${comment.author}</span>
            <span class="comment-content">${comment.content}</span>
            <div class="comment-right">
                <span class="comment-date">${new Date(comment.date).toLocaleDateString()}</span>
                <button class="delete-comment-btn" data-comment-id="${comment.commentId}">Delete</button>
            </div>
        </div>
    `;
    
    const deleteBtn = div.querySelector('.delete-comment-btn');
    deleteBtn.addEventListener('click', function() {
        deleteCommentHandler(comment.commentId);
    });
    
    return div;
}

// delete the comment
function deleteCommentHandler(commentId){
    deleteComment(commentId);
    
    loadImages();
    
    updateCommentsDisplay();
}

// update the comment navigation
function updateCommentNavigation(totalComments){
    const prevBtn = document.getElementById('prev-comments');
    const nextBtn = document.getElementById('next-comments');
    prevBtn.disabled = currentCommentPage === 0;
    const maxPage = Math.ceil(totalComments / 10) - 1;
    nextBtn.disabled = currentCommentPage >= maxPage;
}
