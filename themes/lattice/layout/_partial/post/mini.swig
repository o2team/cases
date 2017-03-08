<article class="mod-post" itemscope itemtype="http://schema.org/Article">
    <a href="{{ url_for(post.link) }}" target="__blank" itemprop="url" title="{{ post.title }}">   

        {% if post.cover.indexOf('//') === 0 || post.cover.startsWith('http') || post.cover.startsWidth('https') %}
        {# <img src="{{post.cover}}"> #}
        <div class="mod-post-cover" style="background-image: url({{post.cover}})" itemscope itemtype="http://schema.org/ImageObject">
        {% else %}
        {# <img src="{{site.data.html5cases.case_cover_prefix+post.cover}}" alt=""> #}
        <div class="mod-post-cover" style="background-image: url({{site.data.html5cases.case_cover_prefix+post.cover}})" itemscope itemtype="http://schema.org/ImageObject">
        {% endif %}
        
            {# <img src="{{ \/^http(s)?\/.test(post.cover) ? post.cover : site.data.html5cases.case_cover_prefix+post.cover }}" alt="{{ post.title }}" itemprop="contentUrl"/> #}
            {# {% if /^http(s)?/.test(post.cover) %} #}
            
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