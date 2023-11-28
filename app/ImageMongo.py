from mongo_conn import mongo, img_fs
from bson.objectid import ObjectId


class ImageMongo:
    def __init__(self, image_file, name: str, user_uuid: str):
        self.name = name
        self.user_uuid = user_uuid
        img_id = ''
        metadata = {'user_uuid': self.user_uuid, 'image_uuid': user_uuid}
        self.img_id = img_fs.put(image_file, filename=name, contentType='image/jpeg', metadata=metadata)

    def get_image(self):
        cover = img_fs.find_one(ObjectId(self.img_id))
        return cover

    def delete_image(self):
        img_fs.delete(ObjectId(self.img_id))

    @staticmethod
    def find_images_by_user_uuid(user_uuid):
        images = img_fs.find({'metadata.user_uuid': user_uuid})
        return images

    @staticmethod
    def delete_images_by_user_uuid(user_uuid):
        images = img_fs.find({'metadata.user_uuid': user_uuid})
        for image in images:
            img_fs.delete(image._id)

    @staticmethod
    def get_image_ids_by_user_uuid(user_uuid):
        images = img_fs.find({'metadata.user_uuid': user_uuid})
        image_ids = [str(image._id) for image in images]
        return image_ids
