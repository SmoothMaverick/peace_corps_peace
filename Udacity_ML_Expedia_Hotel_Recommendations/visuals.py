# Helper methods.
# Author: Udacity + kei
# Date  : May 4, 2018
# Note  : Requires Python 3.  


###########################################
# Suppress matplotlib user warnings
# Necessary for newer version of matplotlib
import warnings
warnings.filterwarnings("ignore", category = UserWarning, module = "matplotlib")
#
# Display inline matplotlib plots with IPython
from IPython import get_ipython
get_ipython().run_line_magic('matplotlib', 'inline')
###########################################

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
import pandas as pd
from time import time
from sklearn.metrics import f1_score, accuracy_score


def distribution(data, features, transformed = False):
    """
    Visualization code for displaying skewed distributions of features
    """
    
    # Create figure
    fig = plt.figure(figsize = (11, 15));

    # Skewed feature plotting
    for i, feature in enumerate(features):
#         ax = fig.add_subplot(1, 2, i+1)
        ax = fig.add_subplot(3, 2, i+1)
        ax.hist(data[feature].dropna(), bins = 100, color = '#00A0A0')
        ax.set_title("'%s' Feature Distribution"%(feature), fontsize = 14)
        ax.set_xlabel("Value")
        ax.set_ylabel("Number of Records")
#         ax.set_ylim((0, 2000))
#         ax.set_yticks([0, 500, 1000, 1500, 2000])
#         ax.set_yticklabels([0, 500, 1000, 1500, ">2000"])

    # Plot aesthetics
    if transformed:
        fig.suptitle("Log-transformed Distributions of Continuous Data Features", \
            fontsize = 16, y = 1.03)
    else:
        fig.suptitle("Skewed Distributions of Continuous Data Features", \
            fontsize = 16, y = 1.03)

    fig.tight_layout()
    fig.show()


def evaluate(results):
    """
    Visualization code to display results of various learners.
    
    inputs:
      - results: a list of supervised learners, and a list of dictionaries 
                  of the statistic results and accuracy from 'train_predict()'.
    """
  
    # Create figure
    fig, ax = plt.subplots(2, 2, figsize = (20,10))

    # Constants
    bar_width = 0.2
    colors = ['#F79F79', '#F7D08A', '#E3F09B', '#87B6A7']
    
    # Super loop to plot four panels of data
    for k, learner in enumerate(results.keys()):
        # print(learner)
        for j, metric in enumerate(['train_time', 'acc_train', 'pred_time', 'acc_test']):
            print()
            for i in np.arange(3):
                
                # Creative plot code
                ax[j // 2, j % 2].bar(i + k * bar_width, results[learner][i][metric], width=bar_width, color=colors[k])
                ax[j // 2, j % 2].set_xticks([0.45, 1.45, 2.45])
                ax[j // 2, j % 2].set_xticklabels(["1%", "10%", "100%"])
                ax[j // 2, j % 2].tick_params(labelsize=20)
                ax[j // 2, j % 2].set_xlabel("Training Set Size", fontsize=20)
                ax[j // 2, j % 2].set_xlim((-0.1, 3.0))               
                # if j % 2 == 1:
                    # ax[j // 2, j % 2].set_ylim((0, 1.2))  # ?? How do I set fixed label?
                    # ax[j // 2, j % 2].set_yticklabels([0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2])
                
    
    # Add unique y-labels
    ax[0, 0].set_ylabel("Time (in seconds)", fontsize=20)
    ax[0, 1].set_ylabel("Accuracy Score", fontsize=20)
    ax[0, 1].set_ylim((0, 0.5))
    ax[1, 0].set_ylabel("Time (in seconds)", fontsize=20)
    ax[1, 1].set_ylabel("Accuracy Score", fontsize=20)
    ax[1, 1].set_ylim((0, 0.5))

    
    # Add titles
    ax[0, 0].set_title("Model Training", fontsize=20)
    ax[0, 1].set_title("Accuracy Score on Training Subset", fontsize=20)
    ax[1, 0].set_title("Model Predicting", fontsize=20)
    ax[1, 1].set_title("Accuracy Score on Testing Set", fontsize=20)
    
    # Add horizontal lines for naive predictors
    # ax[0, 1].axhline(y = accuracy, xmin = -0.1, xmax = 3.0, linewidth = 1, color = 'k', linestyle = 'dashed')
    # ax[1, 1].axhline(y = accuracy, xmin = -0.1, xmax = 3.0, linewidth = 1, color = 'k', linestyle = 'dashed')
    # ax[0, 2].axhline(y = f1, xmin = -0.1, xmax = 3.0, linewidth = 1, color = 'k', linestyle = 'dashed')
    # ax[1, 2].axhline(y = f1, xmin = -0.1, xmax = 3.0, linewidth = 1, color = 'k', linestyle = 'dashed')
    
    # Set y-limits for score panels
    ax[0, 1].set_ylim((0, 1))
    # ax[0, 2].set_ylim((0, 1))
    ax[1, 1].set_ylim((0, 1))
    # ax[1, 2].set_ylim((0, 1))

    # Create patches for the legend
    patches = []
    for i, learner in enumerate(results.keys()):
        patches.append(mpatches.Patch(color = colors[i], label = learner))
    plt.legend(handles=patches, bbox_to_anchor=(0, 2.55), loc='upper center', borderaxespad=0., ncol=4, fontsize=30)
    
    # bbox_to_anchor=(-.80, 2.53), 
    
    # Aesthetics
    plt.suptitle("Performance Metrics for Four Supervised Learning Models", fontsize=35, y=1.10)
    plt.tight_layout()
    plt.show()
    

def feature_plot(importances, X_train, y_train):
    
    # Display the five most important features
    indices = np.argsort(importances)[::-1]
    columns = X_train.columns.values[indices[:5]]
    values = importances[indices][:5]

    # Creat the plot
    fig = plt.figure(figsize = (9,5))
    plt.title("Normalized Weights for First Five Most Predictive Features", fontsize = 16)
    plt.bar(np.arange(5), values, width = 0.6, align="center", color = '#00A000', \
          label = "Feature Weight")
    plt.bar(np.arange(5) - 0.3, np.cumsum(values), width = 0.2, align = "center", color = '#00A0A0', \
          label = "Cumulative Feature Weight")
    plt.xticks(np.arange(5), columns)
    plt.xlim((-0.5, 4.5))
    plt.ylabel("Weight", fontsize = 12)
    plt.xlabel("Feature", fontsize = 12)
    
    plt.legend(loc = 'upper center')
    plt.tight_layout()
    plt.show()  
