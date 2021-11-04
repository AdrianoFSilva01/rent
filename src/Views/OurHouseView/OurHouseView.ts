import ImageReveal from "@/Components/ImageReveal/ImageReveal.vue";
import ImageSlideshow from "@/Components/ImageSlideshow/ImageSlideshow.vue";
import { Options, Vue } from "vue-class-component";

@Options({
    components: {
        ImageSlideshow,
        ImageReveal
    }
})
export default class OurHouseView extends Vue {
    images: Array<string> = [
        "https://hipercentrodomovel.pt/wp-content/uploads/2019/06/QUCfoloBCFC003creta.jpg",
        "https://cf.bstatic.com/images/hotel/max1024x768/144/144383113.jpg",
        "https://cf.bstatic.com/images/hotel/max1024x768/186/186088460.jpg",
        "https://robbreport.com/wp-content/uploads/2019/02/hotel-ottilia-suite_bedroom.jpg?w=1000",
        "https://i.pinimg.com/originals/fe/19/aa/fe19aa5489cfb0a8ce4d5c6d2666c946.jpg"
    ];

    renovationImages: Array<string> = [
        "https://hookedonhouses.net/wp-content/uploads/2014/11/Painted-House-blog-Brick-Ranch-exterior-after-painted-gray-e1563205056518.jpg",
        "https://hookedonhouses.net/wp-content/uploads/2014/11/Painted-House-Brick-Ranch-exterior-BEFORE-e1563204988596.jpg"
    ];
}