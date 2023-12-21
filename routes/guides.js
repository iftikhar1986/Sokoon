const express = require("express");
const router = express.Router();
const models = require("../models/models");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const jwt = require("jsonwebtoken");
const {
    accessTokenSecret,
} = require("../config");

//Get Single Guide
router.get("/Get_SingleGuide/:g_id", (req, res, next) => {
    const { g_id } = req.params;

    models.guides
        .findAll({
            where: {
                id: g_id,
            }
        })

        .then((data) => {
            if (data?.length != 0) {
                console.log("Guide Get Successfully");
                res.json({
                    data: data,
                    successful: true,
                    message: "Guide Get Successfully",
                });
            } else {
                console.log("No Guide Found");
                res.json({
                    successful: false,
                    message: "No Guide Found",
                });
            }
        })

        .catch(function (err) {
            console.log("Failed To Get Guide: ", err);
            res.json({
                successful: false,
                message: "Failed To Get Guide: " + err,
            });
        });
});

//Get All  guides
router.get("/Get_AllGuides", (req, res, next) => {
    models.guides
        .findAll({
            order: [["created_at", "DESC"]],
        })
        .then((data) => {
            if (data?.length > 0) {
                console.log("Get All Guides Successfully");
                res.json({
                    data: data,
                    successful: true,
                    message: "Get All Guides Successfully",
                });
            } else {
                console.log("No Guides Found");
                res.json({
                    successful: false,
                    message: "No Guides Found",
                });
            }
        })
        .catch(function (err) {
            console.log("Failed To Get All  guides: ", err);
            res.json({
                successful: false,
                message: "Failed To Get All  guides: " + err,
            });
        });
});

//Create  guide
router.post("/Create_Guide", async (req, res, next) => {
    const {pdfUrlAr, pdfUrlEn, is_active } = req.body.data;

    values = [
        {
            pdfUrlAr: req.body.pdfUrlAr,
            pdfUrlEn: req.body.pdfUrlAr,
            is_active: req.body.is_active,
            created_at: new Date().toISOString(),
        },
    ];
    await models. guides
        .findAll({
            where: {
                pdfUrlEn: values[0].pdfUrlEn,
            },
        })
        .then((data) => {
            if (data?.length !== 0) {
                console.log("Guide already exists");
                res.json({
                    successful: false,
                    message: "Guide already exists",
                });
            } else {
                models.guides
                    .bulkCreate(values)
                    .then((x) => {
                        if (x?.length !== 0) {
                            const accessToken = jwt.sign(
                                {
                                    successful: true,
                                    message: "Guide Created Successfully",
                                    data: x[0],
                                },
                                accessTokenSecret
                            );
                            res.json({
                                successful: true,
                                message: "Unable to Create New Guide",
                                data: x[0].id,
                            });
                        }
                    })
                    .catch(function (err) {
                        console.log("Failed to Create New Guide: ", err);
                        res.json({
                            successful: false,
                            message: "Failed to Create New Guide: " + err,
                        });
                    });
            }
        })
        .catch(function (err) {
            console.log("Request Data is Empty: ", err);
            res.json({
                successful: false,
                message: "Request Data is Empty: " + err,
            });
        });
});

//Update Guide Detail
router.post("/Update_GuideDetail", async (req, res, next) => {
    console.log("Update Guide Detail API Calling:", req.body.data);
    values = [
        {
            id: req.body.data.id,
            pdfUrlAr: req.body.data.pdfUrlAr,
            pdfUrlEn: req.body.data.pdfUrlAr,
            is_active: req.body.data.is_active,
        },
    ];
    await models.guides
        .update(
            {
                pdfUrlAr: values[0].pdfUrlAr,
                pdfUrlEn: values[0].pdfUrlAr,
                is_active: values[0].is_active,
                updated_at: new Date().toISOString(),
            },
            {
                where: {
                    id: values[0].id,
                },
                returning: true,
                plain: true,
                exclude: ["created_at", "updated_at"],
            }
        )
        .then((data) => {
            const accessToken = jwt.sign(
                {
                    successful: true,
                    message: "Guide Detail Updated Successfully",
                    data: data[1].dataValues,
                },
                accessTokenSecret
            );
            console.log("Response Data: ", data[1].dataValues);
            res.json({
                successful: true,
                message: "Successful",
                data: data[1].dataValues,
                accessToken,
            });
        })
        .catch(function (err) {
            console.log(err);
            res.json({
                message: "Failed" + err,
                successful: false,
            });
        });
});

//Update Guide Status
router.post("/Update_GuideStatus", async (req, res, next) => {
    console.log("Update Guide Status API calling", req.body.data);
    values = [
        {
            id: req.body.data.id,
            status: req.body.data.status,
        },
    ];
    await models.guides
        .update(
            {
                is_active: values[0].status,
                updated_at: new Date().toISOString(),
            },
            {
                where: {
                    id: values[0].id,
                },
                returning: true,
                exclude: ["created_at", "updated_at"],
            }
        )
        .then((data) => {
            const val = {
                id: values[0].id,
                is_active: values[0].status,
            };
            const accessToken = jwt.sign(
                {
                    successful: true,
                    message: "Guide Status Updated Successfully",
                    data: val,
                },
                accessTokenSecret
            );
            console.log("val", val);
            res.json({
                successful: true,
                message: "Successful",
                data: val,
                accessToken,
            });
        })
        .catch(function (err) {
            console.log(err);
            res.json({
                message: "Failed" + err,
                successful: false,
            });
        });
});

//Delete Single Guide
router.get("/Delete_SingleGuide/:id", (req, res, next) => {
    const { id } = req.params;
  
    models.guides
      .destroy({
        where: {
          id: id,
        },
      })
      .then((data) => {
        if (data?.length > 0) {
          console.log("Guide Deleted Successfully.");
          res.json({
            data: data,
            successful: true,
            message: "Guide Deleted Successfully.",
          });
        } else {
          console.log("No Guide Found");
          res.json({
            successful: false,
            message: "No Guide Found",
          });
        }
      })
      .catch(function (err) {
        console.log("Failed To Delete Guide: ", err);
        res.json({
          successful: false,
          message: "Failed To Delete Guide: " + err,
        });
      });
  });


module.exports = router;