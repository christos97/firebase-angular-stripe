import { Injectable } from '@angular/core';
import { Meta, Title } from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(private meta: Meta, private title:Title) { }

  generateTags(tags?: any){
    tags = {
      title: 'Med School Journey',
      description: 'Σημειώσεις, λυμένα θέματα και μαθήματα για την Ιατρική Σχολή Αθηνών',
      image: "../../assets/images/SnRXYQNeMbFATfrq3ErX/Στατιστική-1.png",
      slug: '',
      ...tags
    }

    this.title.setTitle(tags.title)

    this.meta.updateTag({name: 'twitter:card', content: 'summary'})
    this.meta.updateTag({name: 'twitter:site', content: '@medschool-journey'})
    this.meta.updateTag({name: 'twitter:title', content: tags.title})
    this.meta.updateTag({name: 'twitter:description', content: tags.description})
    this.meta.updateTag({name: 'twitter:image', content: tags.image})

    this.meta.updateTag({name: 'og:type', content: 'article'})
    this.meta.updateTag({name: 'og:site_name', content: 'MedSchoolJourney'})
    this.meta.updateTag({name: 'og:title', content: tags.title})
    this.meta.updateTag({name: 'og:description', content: tags.description})
    this.meta.updateTag({name: 'og:image', content: tags.image})
    this.meta.updateTag({name: 'og:url', content: `https://medschool-journey.web.app/`})



  }
}
