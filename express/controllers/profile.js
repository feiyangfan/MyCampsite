import Profile from "../models/Profile.js";

const findOrCreateByUID = async (uid) => {
    let profile = await Profile.findOne({uid});
    if (profile)
        return profile;
    else if (!uid)
        return null;
    profile = new Profile({uid});
    await profile.save();
    return profile;
};

export const getProfile = (req, res, next) => {
    const id = req.params.id;
    const uid = req.auth?.uid;

    if (!id && !uid)
        res.sendStatus(401);
    else if (id && id !== uid) {
        Profile.findById(id)
            .then(profile => res.json(profile))
            .catch(error => next(error));
    } else {
        findOrCreateByUID(uid)
            .then(profile => res.json(profile))
            .catch(error => next(error));
    }
};

export const setProfile = async (req, res, next) => {
    const {
        params: {id},
        body
    } = req;
    const uid = req.auth?.uid;

    try {
        let profile = await (id ? Profile.findById(id) : Profile.findOne({uid}));

        if (!(body.create && profile)) {
            if (!profile)
                profile = new Profile({uid});
            profile.displayName = body.displayName;
            await profile.save();
        }
        res.json(profile);
    } catch (error) {
        next(error);
    }
};
