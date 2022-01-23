<template>
    <div class="review--editor">
        
        <DokaImageEditorModal
            v-bind="editorProps"
            v-if="modalVisible"
            :src="images[currentIndex]"
            @doka:hide="modalVisible = false"
            @doka:show="handleModalShow()"
            @doka:close="handleModalClose()"
            @doka:load="handleModalLoad($event)"
            @doka:process="handleModalProcess($event)"
        />

        <div class="img-wrap" >
            <img :src="images[currentIndex]" alt="sample" class="img-fluid" id="currentImg">
        </div>

        <div class="d-flex justify-content-between w-100 py-3">

            <button class="btn btn-transparent text-light border-light" @click="modalVisible = true">
                <img :src="this.$appImgsPath + 'pencil.svg'" alt="icon" class="icon-img" />
            Edit Image</button>            

            <button class="btn btn-transparent text-light border-0 pr-0" @click="modalVisible = true">
                <img :src="this.$appImgsPath + 'trash-white.svg'" alt="icon" class="icon-img" />
            Delete</button>            

        </div>

    </div>

</template>

<script>
import eventBus from "./eventBus";

// Import vue-doka
import { DokaImageEditorModal } from 'vue-doka';

// Import doka
import {
    // editor
    createDefaultImageReader,
    createDefaultImageWriter,
    locale_en_gb,

    // plugins
    setPlugins,
    plugin_crop,
    plugin_crop_defaults,
    plugin_crop_locale_en_gb,
    plugin_filter,
    plugin_filter_defaults,
    plugin_filter_locale_en_gb,
    plugin_finetune,
    plugin_finetune_defaults,
    plugin_finetune_locale_en_gb,
    plugin_annotate,
    plugin_annotate_locale_en_gb,
    markup_editor_defaults,
    markup_editor_locale_en_gb,

} from 'doka';

setPlugins(plugin_crop, plugin_finetune, plugin_filter, plugin_annotate);
export default {
    props: [
        'currentIndex', 'images'
    ],
    components: {
        DokaImageEditorModal,
    },
    data() {
        return {
            // defaults
            editorProps: {
                imageReader: createDefaultImageReader(),
                imageWriter: createDefaultImageWriter(),
                ...plugin_crop_defaults,
                ...plugin_finetune_defaults,
                ...plugin_filter_defaults,
                ...markup_editor_defaults,
                locale: {
                    ...locale_en_gb,
                    ...plugin_crop_locale_en_gb,
                    ...plugin_finetune_locale_en_gb,
                    ...plugin_filter_locale_en_gb,
                    ...plugin_annotate_locale_en_gb,
                    ...markup_editor_locale_en_gb,
                },
            },

            // modal state
            modalSrc: undefined,
            modalVisible: false,
            modalResult: undefined,

        };
    },
    methods: {

        // modal
        handleModalLoad(res) {
            console.log('modal load', res);
            this.modalSrc = this.imgSrc;
        },
        handleModalShow() {
            console.log('modal show');
        },
        handleModalClose() {
            console.log('modal close...');
        },
        handleModalProcess(res) {
            console.log('modal process', res);
            //default:
            this.modalResult = URL.createObjectURL(res.dest);
            
            //get modal editor result and save
            var blobSrc = this.modalResult;
            if (blobSrc) {
                console.log('blobSrc: ');
                console.log(blobSrc);
                this.fileTobase64(blobSrc);
            } else {
                console.log('no blobSrc found');
            }            
        },

        //convert modal generated file url to blob then to base64
        fileTobase64(fileUrl) {
            fetch(fileUrl)
                .then(response => response.blob())
                .then(blob => {
                    // set needed component data as inner fetch variables
                    var images = this.images;
                    var currentIndex = this.currentIndex;
                    var reader = new FileReader();
                    reader.readAsDataURL(blob); 
                    reader.onloadend = function() {
                        var base64data = reader.result;
                        // user inner fetch variables inside reader object callback
                        images[currentIndex] = base64data;
                        eventBus.$emit("update-single-file", currentIndex, base64data);
                    }
                });
        }

    },    
    mounted() {
        // this.modalSrc = this.imgSrc;
    }
};
</script>

<style lang="scss" scoped>
    .hidden {
        visibility: hidden;
        overflow: hidden;
        height: 1px;
        width: 1px;
    }
</style>
