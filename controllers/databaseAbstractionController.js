var databaseUGUR = require('./databaseUGURController.js');
var mongoose = require('mongoose');
var moment = require('moment');
var tutorController = require('./tutorController.js');

/*
Developer Comments:
Critical Error means that,
Out of the functions that needed to be completed successfully only some occured successfully. When such
a thing happens reverse operation is performed on all the operations that happened successfully, if
such a reverse operation fails then it is a critical error and need to be looked upon. Currently the
critical error is not dealt with



* Take care with the get function, always check whether they are returning an empty array 

Important: Refactor Transaction type

If error occurs and a subsequent error occurs when correcting the error then we have to handle it later

Error handler has special codes
code 1:Successfully completed operations
code 0:Unsuccessful

Other Error Codes:
code 10: Find code 10??
code 11: Less Hours, Redirect to Billing Page
code 12: Critical Error
code 13: Trying to assign locked lesson.

*helpdu permanent financial account is md5 hash of 'ishan'->6f6a4b9e983c1de1ae719bb187de13c7.
*helpdu temporary financial account is md5 hash of 'worldDomination'->4aee963f826c91ac239fba33dfbbe3ca.
*helpdu hours wallet account is md5 hash of 'hemant'->'17563740df9a804bc5e3b31c5cb58984'.


* Great thing is that our primary key is lessonUID, 
but function calls require lessonUID with subject because 
there is no single database storing all lessonUID again lovely mongoDb


*/

/*
Add hours to wallet function.
*/


exports.addHoursWallet = function(UID,isTutor,amount,exchangeRate,transactionType,callback){
	//Generates new transactionUID
	var transactionUID = mongoose.Types.ObjectId();
	var returnedFinance = amount*exchangeRate;
	var params;
	var successArray;
	if(isTutor == 'false'){
		databaseUGUR.doPaymentTransaction(transactionUID,transactionType,'4aee963f826c91ac239fba33dfbbe3ca',UID,returnedFinance,function(returnedObject){
			if(returnedObject.code==7){
				params=5;
				successArray = [];
				//transactionUID,transactionType,UID,lessonUID,transactionComment,transactionAccount,debitAmount,creditAmount,blocked,callback
				databaseUGUR.uploadSpecificWalletLedger(transactionUID,transactionType,UID,false,'','17563740df9a804bc5e3b31c5cb58984',amount,0,false,function(returnedObject){
					if(returnedObject.code==7){
						//Pushing to success Array
						successArray.push({
							code:1,
							callOnError:function()
							{
								databaseUGUR.uploadSpecificWalletLedger(transactionUID,'wallet',UID,false,'','17563740df9a804bc5e3b31c5cb58984',UID,0,amount,false,function(returnedObject){
								//Critical Error handle this later
								});
							}
						});
						//Error Handling Call{
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==7){
								callback({'code':'7','message':'Succefully Added Hours'});
							}
						});
					}
					else if(returnedObject.code==4){
						successArray.push({code:0});
						//Error Handling Call{
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==4){
								callback({'code':'4','message':'Error, Changes reverted','function':'UGURController/addHoursWallet'});
							}
						});
					}	});
				databaseUGUR.uploadFinanceJournal(transactionUID,transactionType,false,'','4aee963f826c91ac239fba33dfbbe3ca',UID,amount*exchangeRate,false,false,function(returnedObject){
					if(returnedObject.code==7){

						successArray.push({
							code:1,
							callOnError:function()
							{
								databaseUGUR.uploadFinanceJournal(transactionUID,'wallet',false,'',UID,'4aee963f826c91ac239fba33dfbbe3ca',amount,false,true,function(returnedObject){
								//Critical Error handle this later
								});
							}
						});
						//Write error handling call
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==7){
								callback({'code':'7','message':'Succefully Added Hours'});
							}
						});
						
					}
					
					else if(returnedObject.code==4){
						successArray.push({code:0});
						//Error Handling Call{
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==4){
								callback({'code':'4','message':'Encounterd error in Saving to main Finance Journal','function':'UGURController/uploadFinanceJournal'});
							}
						});
					}});
				databaseUGUR.uploadWalletJournal(transactionUID,transactionType,false,'',UID,'17563740df9a804bc5e3b31c5cb58984',amount,false,function(returnedObject){
					if(returnedObject.code==7){
						successArray.push({
							code:1,
							callOnError:function()
							{
								databaseUGUR.uploadWalletJournal(transactionUID,'wallet',false,'','17563740df9a804bc5e3b31c5cb58984',UID,amount,false,function(returnedObject){
								//Critical Error handle this later
								});
							}
						});
						//Write error handling calling			
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==7){
								callback({'code':'7','message':'Succefully Added Hours'});
							}
						});
					}
					else if(returnedObject.code==4){
						successArray.push({code:0});
						//Error Handling Call{
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==4){
								callback({'code':'4','message':'Error, Changes reverted','function':'UGURController/addHoursWallet'});
							}
						});
					}});
				databaseUGUR.uploadSpecificFinanceLedger(transactionUID,transactionType,UID,false,'','4aee963f826c91ac239fba33dfbbe3ca',0,amount*exchangeRate,false,function(returnedObject){
					if(returnedObject.code==7){
						//Pushing to success Array
						successArray.push({
							code:1,
							callOnError:function()
							{
								databaseUGUR.uploadSpecificFinanceLedger(transactionUID,'wallet',UID,false,'','4aee963f826c91ac239fba33dfbbe3ca',amount,0,false,function(returnedObject){
								//Critical Error handle this later
								});
							}
						});
						//Error Handling Call{
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==7){
								callback({'code':'7','message':'Succefully Added Hours'});
							}
						});
					}
					else if(returnedObject.code==4){
						successArray.push({code:0});
						//Error Handling Call{
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==4){
								callback({'code':'4','message':'Error, Changes reverted','function':'UGURController/addHoursWallet'});
							}
						});
					}	});
				databaseUGUR.updateCurrentUIDWallet(UID,isTutor,+amount,function(returnedObject){
					if(returnedObject.code==7){
						//Pushing to success Array
						successArray.push({
							code:1,
							callOnError:function()
							{
								databaseUGUR.updateCurrentUIDWallet(UID,isTutor,-amount,function(returnedObject){
								//Critical Error handle this later
								});
							}
						});
						//Error Handling Call{
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==7){
								callback({'code':'7','message':'Succefully Added Hours'});
							}
						});
					}
					else if(returnedObject.code==4){
						successArray.push({code:0});
						//Error Handling Call{
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==4){
								callback({'code':'4','message':'Error, Changes reverted','function':'UGURController/addHoursWallet'});
							}
						});
					}	});
			}
			else{
				callback({'code':'4','message':'Error, Changes reverted','function':'AbstractionController/addHoursWallet'});
			}
		});
	}
	else if(isTutor == 'true'){
		params=5;
		successArray = [];
		//transactionUID,transactionType,UID,lessonUID,transactionComment,transactionAccount,debitAmount,creditAmount,blocked,callback
		databaseUGUR.uploadSpecificWalletLedger(transactionUID,transactionType,UID,false,'','17563740df9a804bc5e3b31c5cb58984',amount,0,false,function(returnedObject){
			if(returnedObject.code==7){
				//Pushing to success Array
				successArray.push({
					code:1,
					callOnError:function()
					{
						databaseUGUR.uploadSpecificWalletLedger(transactionUID,'wallet',UID,false,'','17563740df9a804bc5e3b31c5cb58984',UID,0,amount,false,function(returnedObject){
						//Critical Error handle this later
						});
					}
				});
				//Error Handling Call{
				errorHandling(successArray,params,function(errorObject){
					if (errorObject.code==7){
						callback({'code':'7','message':'Succefully Added Hours'});
					}
				});
			}
			else if(returnedObject.code==4){
				successArray.push({code:0});
				//Error Handling Call{
				errorHandling(successArray,params,function(errorObject){
					if (errorObject.code==4){
						callback({'code':'4','message':'Error, Changes reverted','function':'UGURController/addHoursWallet'});
					}
				});
			}	});
		databaseUGUR.uploadFinanceJournal(transactionUID,transactionType,false,'','4aee963f826c91ac239fba33dfbbe3ca',UID,amount*exchangeRate,false,false,function(returnedObject){
			if(returnedObject.code==7){

				successArray.push({
					code:1,
					callOnError:function()
					{
						databaseUGUR.uploadFinanceJournal(transactionUID,'wallet',false,'',UID,'4aee963f826c91ac239fba33dfbbe3ca',amount,false,true,function(returnedObject){
						//Critical Error handle this later
						});
					}
				});
				//Write error handling call
				errorHandling(successArray,params,function(errorObject){
					if (errorObject.code==7){
						callback({'code':'7','message':'Succefully Added Hours'});
					}
				});
				
			}
			
			else if(returnedObject.code==4){
				successArray.push({code:0});
				//Error Handling Call{
				errorHandling(successArray,params,function(errorObject){
					if (errorObject.code==4){
						callback({'code':'4','message':'Encounterd error in Saving to main Finance Journal','function':'UGURController/uploadFinanceJournal'});
					}
				});
			}});
		databaseUGUR.uploadWalletJournal(transactionUID,transactionType,false,'',UID,'17563740df9a804bc5e3b31c5cb58984',amount,false,function(returnedObject){
			if(returnedObject.code==7){
				successArray.push({
					code:1,
					callOnError:function()
					{
						databaseUGUR.uploadWalletJournal(transactionUID,'wallet',false,'','17563740df9a804bc5e3b31c5cb58984',UID,amount,false,function(returnedObject){
						//Critical Error handle this later
						});
					}
				});
				//Write error handling calling			
				errorHandling(successArray,params,function(errorObject){
					if (errorObject.code==7){
						callback({'code':'7','message':'Succefully Added Hours'});
					}
				});
			}
			else if(returnedObject.code==4){
				successArray.push({code:0});
				//Error Handling Call{
				errorHandling(successArray,params,function(errorObject){
					if (errorObject.code==4){
						callback({'code':'4','message':'Error, Changes reverted','function':'UGURController/addHoursWallet'});
					}
				});
			}});
		databaseUGUR.uploadSpecificFinanceLedger(transactionUID,transactionType,UID,false,'','4aee963f826c91ac239fba33dfbbe3ca',0,amount*exchangeRate,false,function(returnedObject){
			if(returnedObject.code==7){
				//Pushing to success Array
				successArray.push({
					code:1,
					callOnError:function()
					{
						databaseUGUR.uploadSpecificFinanceLedger(transactionUID,'wallet',UID,false,'','4aee963f826c91ac239fba33dfbbe3ca',amount,0,false,function(returnedObject){
						//Critical Error handle this later
						});
					}
				});
				//Error Handling Call{
				errorHandling(successArray,params,function(errorObject){
					if (errorObject.code==7){
						callback({'code':'7','message':'Succefully Added Hours'});
					}
				});
			}
			else if(returnedObject.code==4){
				successArray.push({code:0});
				//Error Handling Call{
				errorHandling(successArray,params,function(errorObject){
					if (errorObject.code==4){
						callback({'code':'4','message':'Error, Changes reverted','function':'UGURController/addHoursWallet'});
					}
				});
			}	});
		databaseUGUR.updateCurrentUIDWallet(UID,isTutor,+amount,function(returnedObject){
			if(returnedObject.code==7){
				//Pushing to success Array
				successArray.push({
					code:1,
					callOnError:function()
					{
						databaseUGUR.updateCurrentUIDWallet(UID,isTutor,-amount,function(returnedObject){
						//Critical Error handle this later
						});
					}
				});
				//Error Handling Call{
				errorHandling(successArray,params,function(errorObject){
					if (errorObject.code==7){
						callback({'code':'7','message':'Succefully Added Hours'});
					}
				});
			}
			else if(returnedObject.code==4){
				successArray.push({code:0});
				//Error Handling Call{
				errorHandling(successArray,params,function(errorObject){
					if (errorObject.code==4){
						callback({'code':'4','message':'Error, Changes reverted','function':'UGURController/addHoursWallet'});
					}
				});
			}	});
	}
};

exports.reAddHoursWallet = function(UID,amount,transactionType,transactionUID,callback){
	var params=3;
	var successArray = [];
	if(transactionUID == 'false'){
		transactionUID = mongoose.Types.ObjectId();
	}
	//exports.uploadSpecificWalletLedger=function(transactionUID,transactionType,UID,lessonUID,transactionComment,transactionAccount,debitAmount,creditAmount,blocked,callback){
	databaseUGUR.uploadSpecificWalletLedger(transactionUID,transactionType,UID,false,'','17563740df9a804bc5e3b31c5cb58984',amount,0,false,function(returnedObject){
		if(returnedObject.code==7){
			//Pushing to success Array
			successArray.push({
				code:1,
				callOnError:function()
				{
					databaseUGUR.uploadSpecificWalletLedger(transactionUID,'wallet',UID,false,'','17563740df9a804bc5e3b31c5cb58984',UID,0,amount,false,function(returnedObject){
					//Critical Error handle this later
					});
				}
			});
			//Error Handling Call{
			errorHandling(successArray,params,function(errorObject){
				if (errorObject.code==7){
					callback({'code':'7','message':'Succefully reAdded Hours'});
				}
			});
		}
		else if(returnedObject.code==4){
			successArray.push({code:0});
			//Error Handling Call{
			errorHandling(successArray,params,function(errorObject){
				if (errorObject.code==4){
					callback({'code':'4','message':'Error, Changes reverted','function':'UGURController/reAddHoursWallet/uploadSpecificWalletLedger'});
				}
			});
		}	});
	databaseUGUR.uploadWalletJournal(transactionUID,transactionType,false,'',UID,'17563740df9a804bc5e3b31c5cb58984',amount,false,function(returnedObject){
		if(returnedObject.code==7){
			successArray.push({
				code:1,
				callOnError:function()
				{
					databaseUGUR.uploadWalletJournal(transactionUID,'wallet',false,'','17563740df9a804bc5e3b31c5cb58984',UID,amount,false,function(returnedObject){
					//Critical Error handle this later
					});
				}
			});
			//Write error handling calling			
			errorHandling(successArray,params,function(errorObject){
				if (errorObject.code==7){
					callback({'code':'7','message':'Succefully reAdded Hours'});
				}
			});
		}
		else if(returnedObject.code==4){
			successArray.push({code:0});
			//Error Handling Call{
			errorHandling(successArray,params,function(errorObject){
				if (errorObject.code==4){
					callback({'code':'4','message':'Error, Changes reverted','function':'UGURController/reAddHoursWallet/uploadWalletJournal'});
				}
			});
		}	});
	databaseUGUR.updateCurrentUIDWallet(UID,'false',+amount,function(returnedObject){
		if(returnedObject.code==7){
			//Pushing to success Array
			successArray.push({
				code:1,
				callOnError:function()
				{
					databaseUGUR.updateCurrentUIDWallet(UID,isTutor,-amount,function(returnedObject){
					//Critical Error handle this later
					});
				}
			});
			//Error Handling Call{
			errorHandling(successArray,params,function(errorObject){
				if (errorObject.code==7){
					callback({'code':'7','message':'Succefully reAdded Hours'});
				}
			});
		}
		else if(returnedObject.code==4){
			successArray.push({code:0});
			//Error Handling Call{
			errorHandling(successArray,params,function(errorObject){
				if (errorObject.code==4){
					callback({'code':'4','message':'Error, Changes reverted','function':'UGURController/reAddHoursWallet/updateCurrentUIDWallet'});
				}
			});
		}	});
};

exports.addHoursCompletedLesson=function(lessonUID,transactionType,callback){
	var params;
	var successArray;
	var transactionUID = mongoose.Types.ObjectId();
	var amount;

	databaseUGUR.getCompletedLesson({'lessonUID':lessonUID},function(returnedLesson){
		if(returnedLesson.code == 1 && returnedLesson.message.length > 0){

			params = 3;
			successArray = [];

			var tutorUID = returnedLesson.message[0].tutorUID;
			var numberOfHours = returnedLesson.message[0].numberOfHours;
			amount = numberOfHours;
			if(transactionType == 'lesson'){
				//transactionUID,transactionType,lessonUID,transactionComment,debitAccount,creditAccount,amount,blocked,callback){
				databaseUGUR.uploadWalletJournal(transactionUID,'lesson',lessonUID,'',tutorUID,'17563740df9a804bc5e3b31c5cb58984',amount,false,function(returnedObject){
						if(returnedObject.code==7){
							successArray.push({
								code:1,
								callOnError:function()
								{
									databaseUGUR.uploadWalletJournal(transactionUID,'wallet',false,'','17563740df9a804bc5e3b31c5cb58984',UID,amount,false,function(returnedObject){
									//Critical Error handle this later
									});
								}
							});
							//Write error handling calling			
							errorHandling(successArray,params,function(errorObject){
								if (errorObject.code==7){
									callback({'code':'7','message':'Succefully Added Hours'});
								}
							});
						}
						else if(returnedObject.code==4){
							successArray.push({code:0});
							//Error Handling Call{
							errorHandling(successArray,params,function(errorObject){
								if (errorObject.code==4){
									callback({'code':'4','message':'Error, Changes reverted','function':'UGURController/addHoursWallet'});
								}
							});
						}});			
				//transactionUID,transactionType,UID,lessonUID,transactionComment,transactionAccount,debitAmount,creditAmount,blocked,callback
				databaseUGUR.uploadSpecificWalletLedger(transactionUID,'lesson',tutorUID,lessonUID,'','17563740df9a804bc5e3b31c5cb58984',amount,0,false,function(returnedObject){
						if(returnedObject.code==7){
							//Pushing to success Array
							successArray.push({
								code:1,
								callOnError:function()
								{
									databaseUGUR.uploadSpecificWalletLedger(transactionUID,'wallet',UID,false,'','17563740df9a804bc5e3b31c5cb58984',UID,0,amount,false,function(returnedObject){
									//Critical Error handle this later
									});
								}
							});
							//Error Handling Call{
							errorHandling(successArray,params,function(errorObject){
								if (errorObject.code==7){
									callback({'code':'7','message':'Succefully Added Hours'});
								}
							});
						}
						else if(returnedObject.code==4){
							successArray.push({code:0});
							//Error Handling Call{
							errorHandling(successArray,params,function(errorObject){
								if (errorObject.code==4){
									callback({'code':'4','message':'Error, Changes reverted','function':'UGURController/addHoursWallet'});
								}
							});
						}	});
				databaseUGUR.updateCurrentUIDWallet(tutorUID,'true',+amount,function(returnedObject){
						if(returnedObject.code==7){
							//Pushing to success Array
							successArray.push({
								code:1,
								callOnError:function()
								{
									databaseUGUR.updateCurrentUIDWallet(UID,isTutor,-amount,function(returnedObject){
									//Critical Error handle this later
									});
								}
							});
							//Error Handling Call{
							errorHandling(successArray,params,function(errorObject){
								if (errorObject.code==7){
									callback({'code':'7','message':'Succefully Added Hours'});
								}
							});
						}
						else if(returnedObject.code==4){
							successArray.push({code:0});
							//Error Handling Call{
							errorHandling(successArray,params,function(errorObject){
								if (errorObject.code==4){
									callback({'code':'4','message':'Error, Changes reverted','function':'UGURController/addHoursWallet'});
								}
							});
						}	});
			}

		}
		else if(returnedLesson.code == 4){
			callback({'code':'4','message':'Error','function':'AbstractController/unassignTutorAbstract'});
		}
		else if(returnedLesson.message.length > 0 && returnedLesson.message[0].locked == 0){
			callback({'code':'4','message':'Trying to unassign, unAssigned lesson','function':'AbstractController/unassignTutorAbstract'});
		}
		else if(returnedLesson.message.length === 0){
			callback({'code':'4','message':'Lesson not found','function':'AbstractController/unassignTutorAbstract'});
		}
	});
};



exports.uploadLessonAbstract=function(studentUID,tutorUID,subject,message,fileLinks,deadlineHours,numberOfHours,privatePublicKey,callback){
	//Generates new transactionUID
	var lessonUID = mongoose.Types.ObjectId();
	databaseUGUR.getCurrentUIDWallet({'UID':studentUID},function(walletObject){
		currentBalance=walletObject[0].currentBalance;
		if (currentBalance>=numberOfHours){
			databaseUGUR.uploadSubjectLesson(lessonUID,studentUID,tutorUID,subject,message,fileLinks,deadlineHours,numberOfHours,privatePublicKey,function(returnedObject){
				if(returnedObject.code==7){
					var notificationUID = mongoose.Types.ObjectId();
					var params;
					var successArray;
					if (privatePublicKey=='true'){
						params = 3;
						successArray = [];
						//Notify the tutor about the lesson both by notification and by mail
						databaseUGUR.uploadTutorLesson(lessonUID,studentUID,tutorUID,subject,message,fileLinks,deadlineHours,numberOfHours,privatePublicKey,function(returnedObject){
							if(returnedObject.code==7){
									//Pushing to success Array
									successArray.push({
										code:1,
										callOnError:function()
										{
											databaseUGUR.removeTutorLesson(tutorUID,lessonUID,function(returnedObject){
											//Critical Error handle this later
											});
										}
									});
									//Error Handling Call{
									errorHandling(successArray,params,function(errorObject){
										if (errorObject.code==7){
											callback({'code':'7','message':'Succefully Added Private Lesson','lessonUID':lessonUID});
										}
									});
							}
							else if(returnedObject.code==4){
								successArray.push({code:0});
								//Error Handling Call{
								errorHandling(successArray,params,function(errorObject){
									if (errorObject.code==4){
										callback({'code':'4','message':'Error, Changes reverted','function':'AbstractController/uploadLessonAbstract/uploadTutorLesson'});
									}
								});
							}	
						});				
/*						databaseUGUR.uploadNotification(tutorUID,notificationUID,notificationType,notification,notificationLink,notificationImageURL,notificationFromUID,notificationFromName,function(returnedObject){
							if(returnedObject.code==7){
									//Pushing to success Array
									successArray.push({
										code:1,
										callOnError:function()
										{
											databaseUGUR.removeNotification(tutorUID,notificationUID,function(returnedObject){
											//Critical Error handle this later
											});
										}
									});
									//Error Handling Call{
									errorHandling(successArray,params,function(errorObject){
										if (errorObject.code==7){
											callback({'code':'7','message':'Succefully Added in Notification'});
										}
									});
							}
							else if(returnedObject.code==4){
								successArray.push({code:0});
								//Error Handling Call{
								errorHandling(successArray,params,function(errorObject){
									if (errorObject.code==4){
										callback({'code':'4','message':'Error, Changes reverted','function':'AbstractController/uploadSubject/uploadNotification'});
									}
								});
							}	
						}); Add notification support, currently this function doesn't work*/
						databaseUGUR.uploadStudentLesson(lessonUID,studentUID,tutorUID,subject,message,fileLinks,deadlineHours,numberOfHours,privatePublicKey,function(returnedObject){
							if(returnedObject.code==7){
									//Pushing to success Array
									successArray.push({
										code:1,
										callOnError:function()
										{
											databaseUGUR.removeStudentLesson(studentUID,lessonUID,function(returnedObject){
											//Critical Error handle this later
											});
										}
									});
									//Error Handling Call{
									errorHandling(successArray,params,function(errorObject){
										if (errorObject.code==7){
											callback({'code':'7','message':'Succefully Added Private Lesson','lessonUID':lessonUID});
										}
									});
							}
							else if(returnedObject.code==4){
								successArray.push({code:0});
								//Error Handling Call{
								errorHandling(successArray,params,function(errorObject){
									if (errorObject.code==4){
										callback({'code':'4','message':'Error, Changes reverted','function':'AbstractController/uploadLessonAbstract/uploadStudentLesson'});
									}
								});
							}	});
						databaseUGUR.uploadSubjectTimeTracker(subject,lessonUID,function(returnedObject){
							if(returnedObject.code==7){
									//Pushing to success Array
									successArray.push({
										code:1,
										callOnError:function()
										{
											databaseUGUR.removeSubjectTimeTracker(lessonUID,subject,function(returnedObject){
											//Critical Error handle this later
											});
										}
									});
									//Error Handling Call{
									errorHandling(successArray,params,function(errorObject){
										if (errorObject.code==7){
											callback({'code':'7','message':'Succefully Added Private Lesson','lessonUID':lessonUID});
										}
									});
							}
							else if(returnedObject.code==4){
								successArray.push({code:0});
								//Error Handling Call{
								errorHandling(successArray,params,function(errorObject){
									if (errorObject.code==4){
										callback({'code':'4','message':'Error, Changes reverted','function':'AbstractController/uploadLessonAbstract/uploadSubjectTimeTracker'});
									}
								});
							}	});
					} //Private Lesson Ends

					else if(privatePublicKey=='false') {
						params=2;
						successArray = [];	
						databaseUGUR.uploadStudentLesson(lessonUID,studentUID,tutorUID,subject,message,fileLinks,deadlineHours,numberOfHours,privatePublicKey,function(returnedObject){
							if(returnedObject.code==7){
								//Pushing to success Array
								successArray.push({
									code:1,
									callOnError:function()
									{
										databaseUGUR.removeStudentLesson(studentUID,lessonUID,function(returnedObject){
										//Critical Error handle this later
										});
									}
								});
								//Error Handling Call{
								errorHandling(successArray,params,function(errorObject){
									if (errorObject.code==7){
										callback({'code':'7','message':'Succefully added Public Lesson in Student Databases','lessonUID':lessonUID});
									}
								});
							}
							else if(returnedObject.code==4){
								successArray.push({code:0});
								//Error Handling Call{
								errorHandling(successArray,params,function(errorObject){
									if (errorObject.code==4){
										callback({'code':'4','message':'Error, Changes reverted','function':'AbstractController/uploadLessonAbstract/uploadStudentLesson'});
									}
								});
							}	});
						databaseUGUR.uploadSubjectTimeTracker(subject,lessonUID,function(returnedObject){
							if(returnedObject.code==7){
									//Pushing to success Array
									successArray.push({
										code:1,
										callOnError:function()
										{
											databaseUGUR.removeSubjectTimeTracker(lessonUID,subject,function(returnedObject){
											//Critical Error handle this later
											});
										}
									});
									//Error Handling Call{
									errorHandling(successArray,params,function(errorObject){
										if (errorObject.code==7){
											callback({'code':'7','message':'Succefully added Public Lesson in Student Databases','lessonUID':lessonUID});
										}
									});
							}
							else if(returnedObject.code==4){
								successArray.push({code:0});
								//Error Handling Call{
								errorHandling(successArray,params,function(errorObject){
									if (errorObject.code==4){
										callback({'code':'4','message':'Error, Changes reverted','function':'AbstractController/uploadLessonAbstract/uploadSubjectTimeTracker'});
									}
								});
							}	});

					}//Public if ends

				} //subject success if ends
				else if(returnedObject.code==4){
					callback(returnedObject);
				}
			});
		}
		else{
			callback({'code':'11','message':'You dont have enough hours in your wallet'});
		}
	});
};


exports.removeHoursWallet=function(UID,isTutor,amount,transactionType,lessonUID,transactionUID,callback){
	var params=3;
	var successArray = [];
	if(transactionUID == 'false'){
		transactionUID = mongoose.Types.ObjectId();
	}
	if(transactionType=='lesson'){
		//transactionUID,transactionType,UID,lessonUID,transactionComment,transactionAccount,debitAmount,creditAmount,blocked,callback
		databaseUGUR.uploadSpecificWalletLedger(transactionUID,transactionType,UID,lessonUID,'','17563740df9a804bc5e3b31c5cb58984',0,amount,false,function(returnedObject){
			if(returnedObject.code==7){
				//Pushing to success Array
				successArray.push({
					code:1,
					callOnError:function()
					{
						databaseUGUR.uploadSpecificWalletLedger(transactionUID,'wallet',UID,false,'','17563740df9a804bc5e3b31c5cb58984',UID,amount,0,false,function(returnedObject){
						//Critical Error handle this later
						});
					}
				});
				//Error Handling Call{
				errorHandling(successArray,params,function(errorObject){
					if (errorObject.code==7){
						callback({'code':'7','message':'Succefully Added Hours','transactionUID':transactionUID});
					}
				});
			}
			else if(returnedObject.code==4){
				successArray.push({code:0});
				//Error Handling Call{
				errorHandling(successArray,params,function(errorObject){
					if (errorObject.code==4){
						callback({'code':'4','message':'Error, Changes reverted','function':'UGURController/removeHoursWallet'});
					}
				});
			}	});
		//transactionUID,transactionType,lessonUID,transactionComment,debitAccount,creditAccount,amount,blocked,callback
		databaseUGUR.uploadWalletJournal(transactionUID,transactionType,lessonUID,'','17563740df9a804bc5e3b31c5cb58984',UID,amount,false,function(returnedObject){
			if(returnedObject.code==7){
				successArray.push({
					code:1,
					callOnError:function()
					{
						databaseUGUR.uploadWalletJournal(transactionUID,'wallet',false,'',UID,'17563740df9a804bc5e3b31c5cb58984',amount,false,function(returnedObject){
						//Critical Error handle this later
						});
					}
				});
				//Write error handling calling			
				errorHandling(successArray,params,function(errorObject){
					if (errorObject.code==7){
						callback({'code':'7','message':'Succefully Added Hours','transactionUID':transactionUID});
					}
				});
			}
			else if(returnedObject.code==4){
				successArray.push({code:0});
				//Error Handling Call{
				errorHandling(successArray,params,function(errorObject){
					if (errorObject.code==4){
						callback({'code':'4','message':'Error, Changes reverted','function':'UGURController/removeHoursWallet'});
					}
				});
			}});
		//UID,isTutor,addBalance,callback
		databaseUGUR.updateCurrentUIDWallet(UID,isTutor,-amount,function(returnedObject){
			if(returnedObject.code==7){
				//Pushing to success Array
				successArray.push({
					code:1,
					callOnError:function()
					{
						databaseUGUR.updateCurrentUIDWallet(UID,isTutor,amount,function(returnedObject){
						//Critical Error handle this later
						});
					}
				});
				//Error Handling Call{
				errorHandling(successArray,params,function(errorObject){
					if (errorObject.code==7){
						callback({'code':'7','message':'Succefully Added Hours','transactionUID':transactionUID});
					}
				});
			}
			else if(returnedObject.code==4){
				successArray.push({code:0});
				//Error Handling Call{
				errorHandling(successArray,params,function(errorObject){
					if (errorObject.code==4){
						callback({'code':'4','message':'Error, Changes reverted','function':'UGURController/removeHoursWallet'});
					}
				});
			}	});
	}
	else if(transactionType == 'wallet' || transactionType == 'payout'){
		//transactionUID,transactionType,UID,lessonUID,transactionComment,transactionAccount,debitAmount,creditAmount,blocked,callback
		databaseUGUR.uploadSpecificWalletLedger(transactionUID,transactionType,UID,'false','','17563740df9a804bc5e3b31c5cb58984',0,amount,false,function(returnedObject){
			if(returnedObject.code==7){
				//Pushing to success Array
				successArray.push({
					code:1,
					callOnError:function()
					{
						databaseUGUR.uploadSpecificWalletLedger(transactionUID,'wallet',UID,false,'','17563740df9a804bc5e3b31c5cb58984',UID,amount,0,false,function(returnedObject){
						//Critical Error handle this later
						});
					}
				});
				//Error Handling Call{
				errorHandling(successArray,params,function(errorObject){
					if (errorObject.code==7){
						callback({'code':'7','message':'Succefully Added Hours','transactionUID':transactionUID});
					}
				});
			}
			else if(returnedObject.code==4){
				successArray.push({code:0});
				//Error Handling Call{
				errorHandling(successArray,params,function(errorObject){
					if (errorObject.code==4){
						callback({'code':'4','message':'Error, Changes reverted','function':'UGURController/removeHoursWallet'});
					}
				});
			}	});
		//transactionUID,transactionType,lessonUID,transactionComment,debitAccount,creditAccount,amount,blocked,callback
		databaseUGUR.uploadWalletJournal(transactionUID,transactionType,'false','','17563740df9a804bc5e3b31c5cb58984',UID,amount,false,function(returnedObject){
			if(returnedObject.code==7){
				successArray.push({
					code:1,
					callOnError:function()
					{
						databaseUGUR.uploadWalletJournal(transactionUID,'wallet',false,'',UID,'17563740df9a804bc5e3b31c5cb58984',amount,false,function(returnedObject){
						//Critical Error handle this later
						});
					}
				});
				//Write error handling calling			
				errorHandling(successArray,params,function(errorObject){
					if (errorObject.code==7){
						callback({'code':'7','message':'Succefully Added Hours','transactionUID':transactionUID});
					}
				});
			}
			else if(returnedObject.code==4){
				successArray.push({code:0});
				//Error Handling Call{
				errorHandling(successArray,params,function(errorObject){
					if (errorObject.code==4){
						callback({'code':'4','message':'Error, Changes reverted','function':'UGURController/removeHoursWallet'});
					}
				});
			}});
		//UID,isTutor,addBalance,callback
		databaseUGUR.updateCurrentUIDWallet(UID,isTutor,-amount,function(returnedObject){
			if(returnedObject.code==7){
				//Pushing to success Array
				successArray.push({
					code:1,
					callOnError:function()
					{
						databaseUGUR.updateCurrentUIDWallet(UID,isTutor,amount,function(returnedObject){
						//Critical Error handle this later
						});
					}
				});
				//Error Handling Call{
				errorHandling(successArray,params,function(errorObject){
					if (errorObject.code==7){
						callback({'code':'7','message':'Succefully Added Hours','transactionUID':transactionUID});
					}
				});
			}
			else if(returnedObject.code==4){
				successArray.push({code:0});
				//Error Handling Call{
				errorHandling(successArray,params,function(errorObject){
					if (errorObject.code==4){
						callback({'code':'4','message':'Error, Changes reverted','function':'UGURController/removeHoursWallet'});
					}
				});
			}	});
	}
};


exports.assignTutor=function(lessonUID,tutorUID,subject,callback){
	var params;
	var successArray;
	currentDate = moment();

	databaseUGUR.getSubjectLesson(subject,{'lessonUID':lessonUID},function(returnedLesson){
		if(returnedLesson.code == 1 && returnedLesson.message.length > 0 && returnedLesson.message[0].locked == 0){
			var studentUID = returnedLesson.message[0].studentUID;
			var privatePublicKey = returnedLesson.message[0].privatePublicKey;
			if(privatePublicKey === true){
				params = 4;
				successArray = [];
				//lessonUID,tutorUID,locked,lockTime,unlockTime,solutionLinks,completed,callback
				databaseUGUR.updateTutorLesson(lessonUID,tutorUID,1,currentDate,'false','false','null',function(returnedObject){
					if(returnedObject.code==7){
							//Pushing to success Array
							successArray.push({
								code:1,
								callOnError:function()
								{
									databaseUGUR.updateTutorLesson(lessonUID,tutorUID,0,'false',currentDate,'false','null',function(returnedObject){
										//Critical Error
									});
								}
							});
							//Error Handling Call{
							errorHandling(successArray,params,function(errorObject){
								if (errorObject.code==7){
									callback({'code':'7','message':'Succefully Assigned Tutor'});
								}
							});
					}
					else if(returnedObject.code==4){
						successArray.push({code:0});
						//Error Handling Call{
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==4){
								callback({'code':'4','message':'Error, Changes reverted','function':'AbstractController/assignTutor/uploadTutorLesson'});
							}
						});
					}	});
				//studentUID,lessonUID,tutorUID,locked,lockTime,unlockTime,solutionLinks,callback
				databaseUGUR.updateStudentLesson(studentUID,lessonUID,tutorUID,1,currentDate,'false','false','null',function(returnedObject){
					if(returnedObject.code==7){
							//Pushing to success Array
							successArray.push({
								code:1,
								callOnError:function()
								{
									databaseUGUR.updateStudentLesson(studentUID,lessonUID,tutorUID,0,'false',currentDate,'false','null',function(returnedObject){
										//Critical Errror
									});
								}
							});
							//Error Handling Call{
							errorHandling(successArray,params,function(errorObject){
								if (errorObject.code==7){
									callback({'code':'7','message':'Succefully Assigned Tutor'});
								}
							});
					}
					else if(returnedObject.code==4){
						successArray.push({code:0});
						//Error Handling Call{
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==4){
								callback({'code':'4','message':'Error, Changes reverted','function':'AbstractController/assignTutor/uploadStudentLesson'});
							}
						});
					}	});
				//lessonUID,subject,tutorUID,locked,lockTime,unlockTime,callback
				databaseUGUR.updateSubjectTimeTracker(lessonUID,subject,tutorUID,1,currentDate,'false',function(returnedObject){
					if(returnedObject.code==7){
							//Pushing to success Array
							successArray.push({
								code:1,
								callOnError:function()
								{
									databaseUGUR.updateSubjectTimeTracker(lessonUID,subject,tutorUID,0,'false',currentDate,'false',function(returnedObject){
										//Critical Error
									});
								}
							});
							//Error Handling Call{
							errorHandling(successArray,params,function(errorObject){
								if (errorObject.code==7){
									callback({'code':'7','message':'Succefully Assigned Tutor'});
								}
							});
					}
					else if(returnedObject.code==4){
						successArray.push({code:0});
						//Error Handling Call{
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==4){
								callback({'code':'4','message':'Error, Changes reverted','function':'AbstractController/assignTutor/uploadSubjectTimeTrackerLesson'});
							}
						});
					}	});
				//subject,lessonUID,tutorUID,locked,lockTime,unlockTime,solutionLinks,callback
				databaseUGUR.updateSubjectLesson(subject,lessonUID,tutorUID,1,currentDate,'false','false','null',function(returnedObject){
					if(returnedObject.code==7){
						//Pushing to success Array
						successArray.push({
							code:1,
							callOnError:function()
							{
								updateSubjectLesson(subject,lessonUID,tutorUID,0,'false',currentDate,'false','null',function(returnedObject){
									//Critical Error
								});
							}
						});
						//Error Handling Call{
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==7){
								callback({'code':'7','message':'Succefully Assigned Tutor'});
							}
						});
					}
					else if(returnedObject.code==4){
						successArray.push({code:0});
						//Error Handling Call{
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==4){
								callback({'code':'4','message':'Error, Changes reverted','function':'AbstractController/assignTutor/uploadSubjectTimeTrackerLesson'});
							}
						});
					}	});
			}
			else if(privatePublicKey === false){
				params = 5;
				successArray = [];
				//message,fileLinks,deadlineHours,numberOfHours
				var message = returnedLesson.message[0].message;
				var fileLinks = returnedLesson.message[0].fileLinks;
				var deadlineHours = returnedLesson.message[0].deadlineHours;
				var numberOfHours = returnedLesson.message[0].numberOfHours;
				//Upload tutor lesson also contains the update tutor lesson code.
				databaseUGUR.uploadTutorLesson(lessonUID,studentUID,tutorUID,subject,message,fileLinks,deadlineHours,numberOfHours,privatePublicKey,function(returnedObject){
					if(returnedObject.code==7){
						databaseUGUR.updateTutorLesson(lessonUID,tutorUID,1,currentDate,'false','false','null',function(returnedObject){
							if(returnedObject.code==7){
									//Pushing to success Array
									successArray.push({
										code:1,
										callOnError:function()
										{
											databaseUGUR.updateTutorLesson(lessonUID,tutorUID,0,'false',currentDate,'false','null',function(returnedObject){
												//Critical Error
											});
										}
									});
									//Error Handling Call{
									errorHandling(successArray,params,function(errorObject){
										if (errorObject.code==7){
											callback({'code':'7','message':'Succefully Assigned Tutor'});
										}
									});
							}
							else if(returnedObject.code==4){
								successArray.push({code:0});
								//Error Handling Call{
								errorHandling(successArray,params,function(errorObject){
									if (errorObject.code==4){
										callback({'code':'4','message':'Error, Changes reverted','function':'AbstractController/assignTutor/uploadTutorLesson'});
									}
								});
							}	
						});
							//Pushing to success Array
							successArray.push({
								code:1,
								callOnError:function()
								{
									databaseUGUR.removeTutorLesson(tutorUID,lessonUID,function(returnedObject){
									//Critical Error handle this later
									});
								}
							});
							//Error Handling Call{
							errorHandling(successArray,params,function(errorObject){
								if (errorObject.code==7){
									callback({'code':'7','message':'Succefully Added in TutorLesson'});
								}
							});
					}
					else if(returnedObject.code==4){
						successArray.push({code:0});
						//Error Handling Call{
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==4){
								callback({'code':'4','message':'Error, Changes reverted','function':'AbstractController/uploadSubject/uploadTutorLesson'});
							}
						});
					}	});		
				//studentUID,lessonUID,tutorUID,locked,lockTime,unlockTime,solutionLinks,callback
				databaseUGUR.updateStudentLesson(studentUID,lessonUID,tutorUID,1,currentDate,'false','false','null',function(returnedObject){
					if(returnedObject.code==7){
							//Pushing to success Array
							successArray.push({
								code:1,
								callOnError:function()
								{
									databaseUGUR.updateStudentLesson(studentUID,lessonUID,tutorUID,0,'false',currentDate,'false','null',function(returnedObject){
										//Critical Errror
									});
								}
							});
							//Error Handling Call{
							errorHandling(successArray,params,function(errorObject){
								if (errorObject.code==7){
									callback({'code':'7','message':'Succefully Assigned Tutor'});
								}
							});
					}
					else if(returnedObject.code==4){
						successArray.push({code:0});
						//Error Handling Call{
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==4){
								callback({'code':'4','message':'Error, Changes reverted','function':'AbstractController/assignTutor/uploadStudentLesson'});
							}
						});
					}	});
				//lessonUID,subject,tutorUID,locked,lockTime,unlockTime,callback
				databaseUGUR.updateSubjectTimeTracker(lessonUID,subject,tutorUID,1,currentDate,'false',function(returnedObject){
					if(returnedObject.code==7){
							//Pushing to success Array
							successArray.push({
								code:1,
								callOnError:function()
								{
									databaseUGUR.updateSubjectTimeTracker(lessonUID,subject,tutorUID,0,'false',currentDate,'false',function(returnedObject){
										//Critical Error
									});
								}
							});
							//Error Handling Call{
							errorHandling(successArray,params,function(errorObject){
								if (errorObject.code==7){
									callback({'code':'7','message':'Succefully Assigned Tutor'});
								}
							});
					}
					else if(returnedObject.code==4){
						successArray.push({code:0});
						//Error Handling Call{
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==4){
								callback({'code':'4','message':'Error, Changes reverted','function':'AbstractController/assignTutor/uploadSubjectTimeTrackerLesson'});
							}
						});
					}	});	
				//subject,lessonUID,tutorUID,locked,lockTime,unlockTime,solutionLinks,callback
				databaseUGUR.updateSubjectLesson(subject,lessonUID,tutorUID,1,currentDate,'false','false','null',function(returnedObject){
					if(returnedObject.code==7){
						//Pushing to success Array
						successArray.push({
							code:1,
							callOnError:function()
							{
								updateSubjectLesson(subject,lessonUID,tutorUID,0,'false',currentDate,'false','null',function(returnedObject){
									//Critical Error
								});
							}
						});
						//Error Handling Call{
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==7){
								callback({'code':'7','message':'Succefully Assigned Tutor'});
							}
						});
					}
					else if(returnedObject.code==4){
						successArray.push({code:0});
						//Error Handling Call{
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==4){
								callback({'code':'4','message':'Error, Changes reverted','function':'AbstractController/assignTutor/uploadSubjectTimeTrackerLesson'});
							}
						});
					}	});	
			}
		}
		else if(returnedLesson.code == 4){
			callback({'code':'4','message':'Error','function':'AbstractController/assignTutor'});
		}
		else if(returnedLesson.message.length > 0 && returnedLesson.message[0].locked == 1){
			callback({'code':'13','message':'Trying to assign Locked Lesson','function':'AbstractController/assignTutor'});
		}
		else if(returnedLesson.message.length === 0){
			callback({'code':'4','message':'Lesson not found','function':'AbstractController/assignTutor'});
		}
	});
};

//This function uploads the solution links and also sets the tutor/student lessons completed state to true
exports.uploadSolutionLessonAbstract=function(lessonUID,subject,solutionLinks,callback){
	var params;
	var successArray;
	databaseUGUR.getSubjectLesson(subject,{'lessonUID':lessonUID},function(returnedLesson){
		if(returnedLesson.code == 1 && returnedLesson.message.length > 0 && returnedLesson.message[0].locked == 1){
			var studentUID = returnedLesson.message[0].studentUID;
			var tutorUID = returnedLesson.message[0].tutorUID;
			params = 3;
			successArray = [];
				//Notfiy the student that the lesson is complete both by mail and notification
				//lessonUID,tutorUID,locked,lockTime,unlockTime,solutionLinks,completed,callback
				databaseUGUR.updateTutorLesson(lessonUID,tutorUID,'false','false','false',solutionLinks,'true',function(returnedObject){
					if(returnedObject.code==7){
							//Pushing to success Array
							successArray.push({
								code:1,
								callOnError:function()
								{
									databaseUGUR.updateTutorLesson(lessonUID,tutorUID,'false','false','false','','false',function(returnedObject){
										//Critical Error
									});
								}
							});
							//Error Handling Call{
							errorHandling(successArray,params,function(errorObject){
								if (errorObject.code==7){
									callback({'code':'7','message':'Succefully Uploaded Solutions'});
								}
							});
					}
					else if(returnedObject.code==4){
						successArray.push({code:0});
						//Error Handling Call{
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==4){
								callback({'code':'4','message':'Error, Changes reverted','function':'AbstractController/uploadSolutionLessonAbstract/updateTutorLesson'});
							}
						});
					}	});
				//studentUID,lessonUID,tutorUID,locked,lockTime,unlockTime,solutionLinks,completed,callback
				databaseUGUR.updateStudentLesson(studentUID,lessonUID,tutorUID,'false','false','false',solutionLinks,'true',function(returnedObject){
					if(returnedObject.code==7){
							//Pushing to success Array
							successArray.push({
								code:1,
								callOnError:function()
								{
									databaseUGUR.updateStudentLesson(studentUID,lessonUID,tutorUID,'false','false','false','','false',function(returnedObject){
										//Critical Errror
									});
								}
							});
							//Error Handling Call{
							errorHandling(successArray,params,function(errorObject){
								if (errorObject.code==7){
									callback({'code':'7','message':'Succefully Uploaded Solutions'});
								}
							});
					}
					else if(returnedObject.code==4){
						successArray.push({code:0});
						//Error Handling Call{
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==4){
								callback({'code':'4','message':'Error, Changes reverted','function':'AbstractController/uploadSolutionLessonAbstract/updateStudentLesson'});
							}
						});
					}	});
				//subject,lessonUID,tutorUID,locked,lockTime,unlockTime,solutionLinks,completed,callback
				databaseUGUR.updateSubjectLesson(subject,lessonUID,tutorUID,'false','false','false',solutionLinks,'true',function(returnedObject){
					if(returnedObject.code==7){
						//Pushing to success Array
						successArray.push({
							code:1,
							callOnError:function()
							{
								updateSubjectLesson(subject,lessonUID,tutorUID,'false','false','false','','false',function(returnedObject){
									//Critical Error
								});
							}
						});
						//Error Handling Call{
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==7){
								callback({'code':'7','message':'Succefully Uploaded Solutions'});
							}
						});
					}
					else if(returnedObject.code==4){
						successArray.push({code:0});
						//Error Handling Call{
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==4){
								callback({'code':'4','message':'Error, Changes reverted','function':'AbstractController/uploadSolutionLessonAbstract/updateSubjectLesson'});
							}
						});
					}	});
				//Add the student Notification function here
		}
		else if(returnedLesson.code == 4){
			callback({'code':'4','message':'Error','function':'AbstractController/assignTutor/getSubjectLesson'});
		}
		else if(returnedLesson.message.length > 0 && returnedLesson.message[0].locked == 0 ){
			callback({'code':'4','message':'Trying to upload solutions where there is no tutor','function':'AbstractController/assignTutor'});
		}
		else if(returnedLesson.message.length === 0){
			callback({'code':'4','message':'Lesson not found','function':'AbstractController/assignTutor'});
		}
	});
};

exports.unassignTutorAbstract=function(lessonUID,subject,callback){
	var params;
	var successArray;
	currentDate = moment();

	databaseUGUR.getSubjectLesson(subject,{'lessonUID':lessonUID},function(returnedLesson){
		if(returnedLesson.code == 1 && returnedLesson.message.length > 0 && returnedLesson.message[0].locked == 1){

			params = 4;
			successArray = [];

			var studentUID = returnedLesson.message[0].studentUID;
			var message = returnedLesson.message[0].message;
			var fileLinks = returnedLesson.message[0].fileLinks;
			var deadlineHours = returnedLesson.message[0].deadlineHours;
			var numberOfHours = returnedLesson.message[0].numberOfHours;
			var privatePublicKey = returnedLesson.message[0].privatePublicKey;
			var tutorUID = returnedLesson.message[0].tutorUID;

			//tutorUID,lessonUID,callback
			databaseUGUR.removeTutorLesson(tutorUID,lessonUID,function(returnedObject){
				if(returnedObject.code==7){
						//Pushing to success Array
						successArray.push({
							code:1,
							callOnError:function()
							{
								databaseUGUR.uploadTutorLesson(lessonUID,studentUID,tutorUID,subject,message,fileLinks,deadlineHours,numberOfHours,privatePublicKey,function(returnedObject){
									//Critical Error
								});
							}
						});
						//Error Handling Call{
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==7){
								callback({'code':'7','message':'Succefully Unassigned Tutor'});
							}
						});
				}
				else if(returnedObject.code==4){
					successArray.push({code:0});
					//Error Handling Call{
					errorHandling(successArray,params,function(errorObject){
						if (errorObject.code==4){
							callback({'code':'4','message':'Error, Changes reverted','function':'AbstractController/unassignTutorAbstract/removeTutorLesson'});
						}
					});
				}	});		
			//studentUID,lessonUID,tutorUID,locked,lockTime,unlockTime,solutionLinks,callback
			databaseUGUR.updateStudentLesson(studentUID,lessonUID,'',0,'false',currentDate,'false','null',function(returnedObject){
				if(returnedObject.code==7){
						//Pushing to success Array
						successArray.push({
							code:1,
							callOnError:function()
							{
								databaseUGUR.updateStudentLesson(studentUID,lessonUID,tutorUID,1,'false','false','false','null',function(returnedObject){
									//Critical Errror
								});
							}
						});
						//Error Handling Call{
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==7){
								callback({'code':'7','message':'Succefully unAssigned Tutor'});
							}
						});
				}
				else if(returnedObject.code==4){
					successArray.push({code:0});
					//Error Handling Call{
					errorHandling(successArray,params,function(errorObject){
						if (errorObject.code==4){
							callback({'code':'4','message':'Error, Changes reverted','function':'AbstractController/unassignTutorAbstract/updateStudentLesson'});
						}
					});
				}	});
			//lessonUID,subject,tutorUID,locked,lockTime,unlockTime,callback
			databaseUGUR.updateSubjectTimeTracker(lessonUID,subject,'',0,'false',currentDate,function(returnedObject){
				if(returnedObject.code==7){
						//Pushing to success Array
						successArray.push({
							code:1,
							callOnError:function()
							{
								databaseUGUR.updateSubjectTimeTracker(lessonUID,subject,tutorUID,1,'false','false','false',function(returnedObject){
									//Critical Error
								});
							}
						});
						//Error Handling Call{
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==7){
								callback({'code':'7','message':'Succefully unAssigned Tutor'});
							}
						});
				}
				else if(returnedObject.code==4){
					successArray.push({code:0});
					//Error Handling Call{
					errorHandling(successArray,params,function(errorObject){
						if (errorObject.code==4){
							callback({'code':'4','message':'Error, Changes reverted','function':'AbstractController/unassignTutorAbstract/updateSubjectTimeTracker'});
						}
					});
				}	});	
			//subject,lessonUID,tutorUID,locked,lockTime,unlockTime,solutionLinks,callback
			databaseUGUR.updateSubjectLesson(subject,lessonUID,'',0,'false',currentDate,'false','null',function(returnedObject){
				if(returnedObject.code==7){
					//Pushing to success Array
					successArray.push({
						code:1,
						callOnError:function()
						{
							updateSubjectLesson(subject,lessonUID,tutorUID,1,'false','false','false','null',function(returnedObject){
								//Critical Error
							});
						}
					});
					//Error Handling Call{
					errorHandling(successArray,params,function(errorObject){
						if (errorObject.code==7){
							callback({'code':'7','message':'Succefully unAssigned Tutor'});
						}
					});
				}
				else if(returnedObject.code==4){
					successArray.push({code:0});
					//Error Handling Call{
					errorHandling(successArray,params,function(errorObject){
						if (errorObject.code==4){
							callback({'code':'4','message':'Error, Changes reverted','function':'AbstractController/assignTutor/uploadSubjectTimeTrackerLesson'});
						}
					});
				}	});	
		}
		else if(returnedLesson.code == 4){
			callback({'code':'4','message':'Error','function':'AbstractController/unassignTutorAbstract'});
		}
		else if(returnedLesson.message.length > 0 && returnedLesson.message[0].locked == 0){
			callback({'code':'4','message':'Trying to unassign, unAssigned lesson','function':'AbstractController/unassignTutorAbstract'});
		}
		else if(returnedLesson.message.length === 0){
			callback({'code':'4','message':'Lesson not found','function':'AbstractController/unassignTutorAbstract'});
		}
	});
};

exports.completedLessonAbstract=function(lessonUID,subject,callback){
	var params;
	var successArray;
	databaseUGUR.getSubjectLesson(subject,{'lessonUID':lessonUID},function(returnedLesson){
		if(returnedLesson.code == 1 && returnedLesson.message.length > 0 && returnedLesson.message[0].locked == 1){
			databaseUGUR.uploadCompletedLesson(lessonUID,subject,function(returnedErrorCode){
				if(returnedErrorCode.code == 7){

					params = 2;
					successArray = [];
					databaseUGUR.removeSubjectTimeTracker(lessonUID,subject,function(returnedObject){
						if(returnedObject.code==7){
								//Pushing to success Array
								successArray.push({
									code:1,
									callOnError:function()
									{
										//Insert the record again, critical error
									}
								});
								//Error Handling Call{
								errorHandling(successArray,params,function(errorObject){
									if (errorObject.code==7){
										callback({'code':'7','message':'Succefully transfered to completed database'});
									}
								});
						}
						else if(returnedObject.code==4){
							successArray.push({code:0});
							//Error Handling Call{
							errorHandling(successArray,params,function(errorObject){
								if (errorObject.code==4){
									callback({'code':'4','message':'Error, Changes not reverted','function':'AbstractController/completedLessonAbstract/removeSubjectTimeTracker'});
								}
							});
						}	});
					databaseUGUR.removeSubjectLesson(lessonUID,subject,function(returnedObject){
						if(returnedObject.code==7){
								//Pushing to success Array
								successArray.push({
									code:1,
									callOnError:function()
									{
										//Insert the record again, critical error
									}
								});
								//Error Handling Call{
								errorHandling(successArray,params,function(errorObject){
									if (errorObject.code==7){
										callback({'code':'7','message':'Succefully transfered to completed database'});
									}
								});
						}
						else if(returnedObject.code==4){
							successArray.push({code:0});
							//Error Handling Call{
							errorHandling(successArray,params,function(errorObject){
								if (errorObject.code==4){
									callback({'code':'4','message':'Error, Changes not reverted','function':'AbstractController/completedLessonAbstract/removeSubjectLesson'});
								}
							});
						}	});
				
				}
				else if(returnedErrorCode.code == 4){
					callback(returnedErrorCode);
				}
			});
		}
		else if(returnedLesson.code == 4){
			callback({'code':'4','message':'Error','function':'AbstractController/completedLessonAbstract'});
		}
		else if(returnedLesson.message.length > 0 && returnedLesson.message[0].locked == 0){
			callback({'code':'4','message':'Trying to transfer unlocked lesson','function':'AbstractController/completedLessonAbstract'});
		}
		else if(returnedLesson.message.length == 0){
			callback({'code':'4','message':'Lesson not found','function':'AbstractController/completedLessonAbstract'});
		}
	});
};

exports.removeLessonAbstract=function(lessonUID,subject,callback){
	var params;
	var successArray;
	currentDate = moment();

	databaseUGUR.getSubjectLesson(subject,{'lessonUID':lessonUID},function(returnedLesson){
		if(returnedLesson.code == 4){
			callback({'code':'4','message':'Error','function':'AbstractController/assignTutor'});
		}
		else if(returnedLesson.message.length == 0){
			callback({'code':'4','message':'Lesson not found','function':'AbstractController/assignTutor'});
		}
		else if(returnedLesson.code == 1){
			successArray = [];
			var studentUID = returnedLesson.message[0].studentUID;
			var privatePublicKey = returnedLesson.message[0].privatePublicKey;
			var numberOfHours = returnedLesson.message[0].numberOfHours;

			if(returnedLesson.message[0].locked == 0 && privatePublicKey == false){
				params = 3;
			}
			else {
				params = 4;
				var tutorUID = returnedLesson.message[0].tutorUID;
				databaseUGUR.removeTutorLesson(tutorUID,lessonUID,function(returnedObject){
					if(returnedObject.code==7){
							//Pushing to success Array
							successArray.push({
								code:1,
								callOnError:function()
								{
									//Insert the record again, critical error
								}
							});
							//Error Handling Call{
							errorHandling(successArray,params,function(errorObject){
								if (errorObject.code==7){
									callback({'code':'7','message':'Succefully removed lesson','numberOfHours':numberOfHours});
								}
							});
					}
					else if(returnedObject.code==4){
						successArray.push({code:0});
						//Error Handling Call{
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==4){
								callback({'code':'4','message':'Error, Changes not reverted','function':'AbstractController/removeLessonAbstract/removeTutorLesson'});
							}
						});
					}	});
			}
			databaseUGUR.removeSubjectTimeTracker(lessonUID,subject,function(returnedObject){
				if(returnedObject.code==7){
						//Pushing to success Array
						successArray.push({
							code:1,
							callOnError:function()
							{
								//Insert the record again, critical error
							}
						});
						//Error Handling Call{
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==7){
								callback({'code':'7','message':'Succefully removed lesson','numberOfHours':numberOfHours});
							}
						});
				}
				else if(returnedObject.code==4){
					successArray.push({code:0});
					//Error Handling Call{
					errorHandling(successArray,params,function(errorObject){
						if (errorObject.code==4){
							callback({'code':'4','message':'Error, Changes not reverted','function':'AbstractController/removeLessonAbstract/removeSubjectTimeTracker'});
						}
					});
				}	});
			databaseUGUR.removeSubjectLesson(lessonUID,subject,function(returnedObject){
				if(returnedObject.code==7){
						//Pushing to success Array
						successArray.push({
							code:1,
							callOnError:function()
							{
								//Insert the record again, critical error
							}
						});
						//Error Handling Call{
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==7){
								callback({'code':'7','message':'Succefully removed lesson','numberOfHours':numberOfHours});
							}
						});
				}
				else if(returnedObject.code==4){
					successArray.push({code:0});
					//Error Handling Call{
					errorHandling(successArray,params,function(errorObject){
						if (errorObject.code==4){
							callback({'code':'4','message':'Error, Changes not reverted','function':'AbstractController/removeLessonAbstract/removeSubjectLesson'});
						}
					});
				}	});
			databaseUGUR.removeStudentLesson(studentUID,lessonUID,function(returnedObject){
				if(returnedObject.code==7){
						//Pushing to success Array
						successArray.push({
							code:1,
							callOnError:function()
							{
								//Insert the record again, critical error
							}
						});
						//Error Handling Call{
						errorHandling(successArray,params,function(errorObject){
							if (errorObject.code==7){
								callback({'code':'7','message':'Succefully removed lesson','numberOfHours':numberOfHours});
							}
						});
				}
				else if(returnedObject.code==4){
					successArray.push({code:0});
					//Error Handling Call{
					errorHandling(successArray,params,function(errorObject){
						if (errorObject.code==4){
							callback({'code':'4','message':'Error, Changes not reverted','function':'AbstractController/removeLessonAbstract/removeStudentLesson'});
						}
					});
				}	});
		}
	});
};


exports.payoutFinancialTransaction=function(UID,amount,tutorExchangeRate,transactionType,transactionUID,callback){
	var returnedFinance = amount * tutorExchangeRate;
	//doPaymentTransaction=function(transactionUID,transactionType,debitAccount,creditAccount,amount,callback){
	databaseUGUR.doPaymentTransaction(transactionUID,transactionType,UID,'4aee963f826c91ac239fba33dfbbe3ca',returnedFinance,function(returnedObject){
		if(returnedObject.code==7){
			var params=2;
			var successArray = [];
			//uploadFinanceJournal=function(transactionUID,transactionType,lessonUID,transactionComment,debitAccount,creditAccount,amount,blocked,isReversed,callback){
			databaseUGUR.uploadFinanceJournal(transactionUID,transactionType,'false','',UID,'4aee963f826c91ac239fba33dfbbe3ca',returnedFinance,false,false,function(returnedObject){
				if(returnedObject.code==7){

					successArray.push({
						code:1,
						callOnError:function()
						{
							databaseUGUR.uploadFinanceJournal(transactionUID,transactionType,'false','','4aee963f826c91ac239fba33dfbbe3ca',UID,returnedFinance,false,true,function(returnedObject){
							//Critical Error handle this later
							});
						}
					});
					//Write error handling call
					errorHandling(successArray,params,function(errorObject){
						if (errorObject.code==7){
							callback({'code':'7','message':'Succefully completed payout'});
						}
					});
					
				}
				
				else if(returnedObject.code==4){
					successArray.push({code:0});
					//Error Handling Call{
					errorHandling(successArray,params,function(errorObject){
						if (errorObject.code==4){
							callback({'code':'4','message':'Error, Changes reverted','function':'AbstractionController/payoutFinancialTransaction/uploadFinanceJournal'});
						}
					});
				}});
			//uploadSpecificFinanceLedger=function(transactionUID,transactionType,UID,lessonUID,transactionComment,transactionAccount,debitAmount,creditAmount,blocked,callback){
			databaseUGUR.uploadSpecificFinanceLedger(transactionUID,transactionType,UID,'false','','4aee963f826c91ac239fba33dfbbe3ca',returnedFinance,0,false,function(returnedObject){
				if(returnedObject.code==7){
					//Pushing to success Array
					successArray.push({
						code:1,
						callOnError:function()
						{
							databaseUGUR.uploadSpecificFinanceLedger(transactionUID,transactionType,UID,'false','','4aee963f826c91ac239fba33dfbbe3ca',0,returnedFinance,false,function(returnedObject){
							//Critical Error handle this later
							});
						}
					});
					//Error Handling Call{
					errorHandling(successArray,params,function(errorObject){
						if (errorObject.code==7){
							callback({'code':'7','message':'Succefully completed payout'});
						}
					});
				}
				else if(returnedObject.code==4){
					successArray.push({code:0});
					//Error Handling Call{
					errorHandling(successArray,params,function(errorObject){
						if (errorObject.code==4){
							callback({'code':'4','message':'Error, Changes reverted','function':'AbstractionController/payoutFinancialTransaction/uploadSpecificFinanceLedger'});
						}
					});
				}	});
		}
		else{
			callback({'code':'4','message':'Error, Changes reverted','function':'AbstractionController/addHoursWallet'});
		}
	});
};

exports.reviewLesson=function(studentUID,studentName,tutorUID,lessonUID,tutorRating,tutorReview,callback){
	var params = 2;
	var successArray = [];
	var tutorReviewObject={
		'studentUID':studentUID,
		'studentName':studentName,
		'tutorReview':tutorReview,
		'tutorRating':tutorRating
	};

	var tutorChangeObject={
		'addTutorReview':tutorReviewObject
	};
	if(tutorRating == 'true'){
		tutorChangeObject.addTutorRatingPositive = 1;
	}
	else if(tutorRating == 'false'){
		tutorChangeObject.addTutorRatingNegative = 1;
	}


	databaseUGUR.updateCompletedLesson(lessonUID,tutorRating,tutorReview,'null',function(returnedObject){
		if(returnedObject.code==7){
			//Pushing to success Array
			successArray.push({
				code:1,
				callOnError:function()
				{

				}
			});
			//Error Handling Call{
			errorHandling(successArray,params,function(errorObject){
				if (errorObject.code==7){
					callback({'code':'7','message':'Succefully Added Feedback'});
				}
			});
		}
		else if(returnedObject.code==4){
			successArray.push({code:0});
			//Error Handling Call{
			errorHandling(successArray,params,function(errorObject){
				if (errorObject.code==4){
					callback({'code':'4','message':'Error, Changes not reverted','function':'AbstractController/addFeedback/updateCompletedLesson'});
				}
			});
		}	});
	//Call to alpha server to change tutor rating
	tutorController.updateTutorDetails(tutorUID,tutorChangeObject,function(returnedObject){
		if(returnedObject.code == 7){
			successArray.push({
				code:1,
				callOnError:function()
				{
					//No error handling
				}
			});
			//Error Handling Call{
			errorHandling(successArray,params,function(errorObject){
				if (errorObject.code==7){
					callback({'code':'7','message':'Succefully Added Feedback'});
				}
			});
		}
		else if(returnedObject.code==4){
			successArray.push({code:0});
			//Error Handling Call{
			errorHandling(successArray,params,function(errorObject){
				if (errorObject.code==4){
					callback({'code':'4','message':'Error, Changes not reverted','function':'AbstractController/reviewLesson/updateTutorDetails'});
				}
			});
		}});
	
};

exports.flagLesson=function(studentUID,tutorUID,lessonUID,callback){
	var params = 1;
	var successArray = [];
	databaseUGUR.updateCompletedLesson(lessonUID,'null','false','true',function(returnedObject){
		if(returnedObject.code==7){
			//Pushing to success Array
			successArray.push({
				code:1,
				callOnError:function()
				{

				}
			});
			//Error Handling Call{
			errorHandling(successArray,params,function(errorObject){
				if (errorObject.code==7){
					callback({'code':'7','message':'Succefully Flagged Lesson'});
				}
			});
		}
		else if(returnedObject.code==4){
			successArray.push({code:0});
			//Error Handling Call{
			errorHandling(successArray,params,function(errorObject){
				if (errorObject.code==4){
					callback({'code':'4','message':'Error, Changes not reverted','function':'AbstractController/flagLesson/updateCompletedLesson'});
				}
			});
		}	});
};


function errorHandling(successArray,params,callback){
	var firstError = 0;
	//This means that the last inserted element had error
	if(successArray[successArray.length-1].code===0){
		for(var i=0; i<successArray.length-1; i++){
			if(typeof successArray[i].callOnError == 'function')
				successArray[i].callOnError();
			else firstError = 1;
		}
		if(firstError===0)
			callback ({'code':4});
		else if(firstError===1)
			callback({'code':12});
	}
	else if(successArray.length==params){
		 callback({'code':7});
	}	
}
