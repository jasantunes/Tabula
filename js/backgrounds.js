/**
 * Random background
 * Ideally, this should be the random background of the day and be set inside the controller.
 */

backgrounds = [
  { file:"../images/01.jpg", url:"https://www.flickr.com/photos/ragnar1984/2915447817", title:"River of clouds", author:"Ragnar Jensen"},
  { file:"../images/02.jpg", url:"https://www.flickr.com/photos/23737778@N00/7115229223", title:"Kansas Summer Wheat and Storm Panorama", author:"James Watkins"},
  { file:"../images/03.jpg", url:"https://www.flickr.com/photos/72213316@N00/3976007814", title:"Stitched shot of Mt. Rainier and Little Tahoma reflected on Bench Lake", author:"Frank Kovalchek"},
  { file:"../images/04.jpg", url:"https://www.flickr.com/photos/jamesthefirst/7103126949", title:"Landscape outside Barnwell", author:"Jamesthe1st"},
  { file:"../images/06.jpg", url:"https://www.flickr.com/photos/tomsoperphotography/7848654448", title:"Landscape (2008)", author:"Tom Soper"},
  { file:"../images/07.jpg", url:"https://www.flickr.com/photos/katsrcool/11930377725", title:"Snowy Landscape", author:"katsrcool"},
];

var rnd_index = Math.floor(Math.random() * backgrounds.length);

