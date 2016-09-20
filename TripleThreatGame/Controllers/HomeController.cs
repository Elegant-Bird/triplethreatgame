using System;
using System.Collections.Generic;
using System.Linq;
using System.Transactions;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using DotNetOpenAuth.AspNet;
using Microsoft.Web.WebPages.OAuth;
using WebMatrix.WebData;
using TripleThreatGame.Filters;
using TripleThreatGame.Models;

namespace TripleThreatGame.Controllers
{
    public class HomeController : Controller
    {

       

        public ActionResult Index()
        {
            if (User.Identity.IsAuthenticated)
            {
                             

                return RedirectToAction("Game");                     

             
            }
            else
            {

                return RedirectToAction("Login", "Account");
            }

        }//end index

        public ActionResult About()
        {
            ViewBag.Message = "Your app description page.";

            return View();
        }

        public ActionResult Contact()
        {
            
            ViewBag.Message = "Your contact page(You are not logged in.";

            return View();
        }

        public ActionResult Game()
        {
            //Obtaining the data source
            var dbTripleThreatGame = new TripleThreatGameDataContext();

            int userId = 1;

            // Create a Game Object To Store the userid in the games table.
            game newGame = new game();
            newGame.UserId = userId;

            dbTripleThreatGame.games.InsertOnSubmit(newGame);
            dbTripleThreatGame.SubmitChanges();
            gameModels currentGame = new gameModels();
            currentGame.ID = newGame.ID;

            return View("Game", currentGame);
        }

        public ActionResult Cards()
        {

            return PartialView();
        }

        public ActionResult Board()
        {

            return PartialView();
        }


   
        public ActionResult Chat()
        {
            //Obtaining the data source
            var dbTripleThreatGame = new TripleThreatGameDataContext();   
            
            //gets stuff from the DB           
            IEnumerable<chatModels>result = (from c in dbTripleThreatGame.chats
                                   select new chatModels { chat = c.chat1 });

            return PartialView(result);
        }

        [HttpPost]
        public ActionResult Chat(string chatField = null)
        {

            //Obtaining the data source
            var dbTripleThreatGame = new TripleThreatGameDataContext();


            if (chatField != null)
            {
                // Query the database for the row to be updated.
                var getRowToBeUpdated =
                    from c in dbTripleThreatGame.chats
                    where c.Id == 1
                    select c;

                // Execute the query, and change the column values
                // you want to change.
                foreach (chat c in getRowToBeUpdated)
                {
                    c.chat1 += "<br>" + "<span class=\"chat-name\">" + User.Identity.Name + "</span> " + chatField + "<span class=\"chat-time\">&nbsp;&nbsp;" + DateTime.Now + "</span>";
                }

              

                // Submit the changes to the database.
                try
                {
                    dbTripleThreatGame.SubmitChanges();
                }
                catch (Exception e)
                {
                    //Console.WriteLine(e);
                    // Provide for exceptions.
                }
            }

            //gets stuff from the DB           
            IEnumerable<chatModels> result = (from c in dbTripleThreatGame.chats
                                              select new chatModels { chat = c.chat1 });

            return PartialView(result);
        }    


    }
}
