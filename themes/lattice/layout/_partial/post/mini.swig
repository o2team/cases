<article class="mod-post" itemscope itemtype="http://schema.org/Article">
    <a href="{{ url_for(post.link) }}" target="__blank" itemprop="url" title="{{ post.title }}">
        <div class="mod-post-cover" itemscope itemtype="http://schema.org/ImageObject">
            <img src="{{ site.data.html5cases.case_cover_prefix+post.cover }}" alt="{{ post.title }}" itemprop="contentUrl"/>
            <div class="mod-post-qrcode">
            	<img src="http://qr.liantu.com/api.php?text={{post.link}}" alt="">
            </div>
        </div>
        <div class="mod-post-info">
            <h3 class="mod-post-tit" itemprop="name headline">{{ post.title }}</h3>
            <p class="mod-post-desc" itemprop="about">{{ post.subtitle }}</p>
            <p class="mod-post-date" itemprop="publishDate">{{ post.publishDate|date("Y-m-d") }}</p>
        </div>
    </a>
</article>