function eventListener(){
  const input=document.getElementById('user-input')
  input.addEventListener('input',()=>{
    const value=input.value
    if(value==''){
      userFound()
      const userHtml=document.querySelector('.user-info')
      const profileHtml=document.querySelector('.profile-button')
      const repoDiv=document.querySelector('.user-repos')
      userHtml.innerHTML=""
      profileHtml.innerHTML=""
      repoDiv.innerHTML=""
    }
else{
  getUserInfo(input)
  .then(result=>{
    userFound()
    enterHtmlData(result)
   return getUserRepos(`${result.repos_url}?client_id=3d1945f2c7be74b2bc66&client_secret=af2a5d85280793f88b4ef7e0b4bf211a9738d2f3`)
  })
  .then(repos=>{
    enterReposData(repos)
  })
  .catch(err=>{
   userNotFound()
    let data=window.localStorage.getItem('Data')
    data=JSON.parse(data)
    enterHtmlData(data)
   
  })
}


  })
}

// Making a Request For Repos
async function getUserRepos(url){
  const response=await fetch(url)
  const data=await response.json()
  return data
}

//Entering Data Of User Repos
function enterReposData(reposArray){
  const repoDiv=document.querySelector('.user-repos')
 const firstFiveRepos= reposArray.filter((repo,repoNum)=>{
    return repoNum<5
  })
let output=`
<h2 class="repo-heading">latest repos</h2>`
if(firstFiveRepos.length>0){
  firstFiveRepos.map(repo=>{
    output+=`
    <div class="repo">
    <a class="repo-link" target="_blank" href="${repo.owner.html_url}">${repo.name}</a>
    <div class="badges">
      <span class="badge" style="background-color: #0d6efd">Star:${repo.stargazers_count}</span>
      <span class="badge" style="background-color: #198754">Watchers:${repo.watchers}</span>
      <span class="badge" style="background-color: #198754">Forks:${repo.forks}</span>
    </div>
  </div>
    `
  })
 
}
else{
  output+=`
  <div class="repo">
  No Repos Found
</div>
  `

}
repoDiv.innerHTML=output

}

// Making a Request For User Details
async function getUserInfo(input){
 
  const username=input.value
  const url=`https://api.github.com/users/${username}?client_id=3d1945f2c7be74b2bc66&client_secret=cb9b81bc4efedc756369b8e25016115f227eb00e`
  try{
    const response= await fetch(url)
    if(response.ok){
      const data=await response.json()
      window.localStorage.clear()
      dataAtLocalStorage(data)
      return data
    }
    else
    throw new Error('Something Happened')
   
  }
  catch(error){
    userNotFound()
    let data=window.localStorage.getItem('Data')
    data=JSON.parse(data)
    enterHtmlData(data)
  }
}

// Entering Data Of User Details
function enterHtmlData(user){

  const userHtml=document.querySelector('.user-info')
  const profileHtml=document.querySelector('.profile-button')
let output=`
      <img src="${user.avatar_url}" alt="Avatar" class="user-image" />
      <div class="user-details">
        <div class="badges">
          <span class="badge" style="background-color: #0d6efd"
            >public repos:${user.public_repos}</span
          >
          <span class="badge" style="background-color: #adb5bd"
            >public gists:${user.public_gists}</span
          >
          <span class="badge" style="background-color: #198754">followers:${user.followers}</span>
          <span class="badge" style="background-color: #0dcaf0">following:${user.following}</span>
        </div>
        <p class="user-company">company:${user.company}</p>
        <p class="user-website">website/Blog:${user.blog}</p>
        <p class="user-location">location:${user.location}</p>
        <p class="user-member">member since:${user.created_at}</p>
      </div> 
`

userHtml.innerHTML=output

profileHtml.innerHTML=`
<a class="pro-btn" href="${user.html_url}" target="_blank">View Profile</a>
`

}

// Storing Data al local Storage
function dataAtLocalStorage(data){
 window.localStorage.setItem('Data',JSON.stringify(data))
}

// Showing Error 
function userNotFound(){
 const element= document.querySelector('.not-found')
 element.style.display=`block`

}

// Removing Error
function userFound(){
  const element= document.querySelector('.not-found')
  element.style.display=`none`
}

eventListener()
