<template>
    <transition name="fade" @enter="transitionEnded = false" @after-enter="transitionEnded = true">
        <div v-show="show" class="bg-gold flex fixed w-full h-full z-50 top-0 left-0 transition duration-500">
            <div class="flex flex-col justify-between w-3/12 p-20">
                <div @click="toogleDisplay" class="closeButton" :class="transitionEnded ? 'opacity-100':'opacity-0'">
                    <hr class="absolute border-px w-1/2 transform rotate-45" />
                    <hr class="absolute border-px w-1/2 transform -rotate-45" />
                </div>
                <div class="space-y-4">
                    <template v-for="(text, index) in ['Apartments', 'Contact & Directions', 'Our House', 'Impressions']" :key="index">
                        <template v-if="text === 'Apartments'">
                            <router-link to="/apartments" @click="backToTop">
                                <p class="main-information transform"
                                   :ontransitionend="changeDelay"
                                   :style="transitionDelay ? 'transition-delay: ' + (50 * index) + 'ms' : 'transition-delay: 0s'"
                                   :class="transitionEnded ? 'translate-x-0 opacity-100':'-translate-x-8 opacity-0'"
                                   @click="toogleDisplay"
                                >
                                    {{ text }}
                                </p>
                            </router-link>
                        </template>
                        <temaplate v-else-if="text === 'Our House'">
                            <router-link to="/ourhouse" @click="backToTop">
                                <p class="main-information transform mt-4"
                                   :ontransitionend="changeDelay"
                                   :style="transitionDelay ? 'transition-delay: ' + (50 * index) + 'ms' : 'transition-delay: 0s'"
                                   :class="transitionEnded ? 'translate-x-0 opacity-100':'-translate-x-8 opacity-0'"
                                   @click="toogleDisplay"
                                >
                                    {{ text }}
                                </p>
                            </router-link>
                        </temaplate>
                        <template v-else>
                            <p class="main-information transform"
                               :ontransitionend="changeDelay"
                               :style="transitionDelay ? 'transition-delay: ' + (50 * index) + 'ms' : 'transition-delay: 0s'"
                               :class="transitionEnded ? 'translate-x-0 opacity-100':'-translate-x-8 opacity-0'"
                            >
                                {{ text }}
                            </p>
                        </template>
                    </template>
                </div>
                <div>
                    <template v-for="(text, index) in ['Terms', 'Priacy']" :key="index">
                        <p class="transform"
                           :ontransitionend="changeDelay"
                           :style="transitionDelay ? 'transition-delay: ' + (100 + 50 * index) + 'ms' : 'transition-delay: 0s'"
                           :class="transitionEnded ? 'translate-x-0 opacity-100':'-translate-x-8 opacity-0'"
                        >
                            {{ text }}
                        </p>
                    </template>
                </div>
            </div>
            <div class="contact-info flex-grow p-20 flex items-end justify-between bg-cover"
                 style="background-image: url(https://cdn.budgetyourtrip.com/images/photos/headerphotos/large/portugal_madeiraislands.jpg)"
            >
                <div class="flex space-x-8 transition duration-main transform"
                     :ontransitionend="changeDelay"
                     :style="transitionDelay ? 'transition-delay: ' + (300) + 'ms' : 'transition-delay: 0s'"
                     :class="transitionEnded ? 'translate-y-0 opacity-100':'translate-y-8 opacity-0'"
                >
                    <span class="text-white text-sm opacity-50">
                        M
                    </span>
                    <span class="text-white text-sm">
                        info@madeira.pt
                    </span>
                </div>
                <div class="flex space-x-6">
                    <div class="social-media text-gold hover:text-white transition transform"
                         :ontransitionend="changeDelay"
                         :style="transitionDelay ? 'transition-delay: ' + (500) + 'ms; transition-duration: var(--transition-duration-main)' : 'transition-delay: 0s; transition-duration: 0s'"
                         :class="transitionEnded ? 'translate-y-0 opacity-100':'translate-y-8 opacity-0'"
                    >
                        <div class="icon facebook-icon bg-white">
                            <svg viewBox="0 0 100 100">
                                <use href="@/Assets/Images/facebook.svg#facebook" />
                            </svg>
                        </div>
                        <span class="text-sm text-white">
                            Facebook
                        </span>
                    </div>
                    <div class="social-media text-white hover:text-gold transition transform"
                         :ontransitionend="changeDelay"
                         :style="transitionDelay ? 'transition-delay: ' + (700) + 'ms; transition-duration: var(--transition-duration-main)' : 'transition-delay: 0s; transition-duration: 0s'"
                         :class="transitionEnded ? 'translate-y-0 opacity-100':'translate-y-8 opacity-0'"
                    >
                        <div class="icon instagram-icon bg-gold p-1">
                            <svg viewBox="0 0 100 100">
                                <use href="@/Assets/Images/instagram.svg#instagram" />
                            </svg>
                        </div>
                        <span class="text-sm text-white">
                            Instagram
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script lang="ts" src="./OverlayView.ts" />

<style scoped lang="postcss" src="./OverlayView.pcss" />